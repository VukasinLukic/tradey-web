"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";

export type TrailConfig = {
  imageLifespan?: number;
  removalTickMs?: number;
  mouseThreshold?: number;
  minMovementForImage?: number;
  inDuration?: number;
  outDuration?: number;
  maxRotationFactor?: number;
  baseRotation?: number;
  speedSmoothingFactor?: number;
  minImageSize?: number;
  maxImageSize?: number;
  staggerOut?: number;
};

export type TrailWrapperProps = React.PropsWithChildren<{
  images: string[];
  className?: string;
  config?: TrailConfig;
}>;

const DEFAULTS: Required<TrailConfig> = {
  imageLifespan: 600,
  removalTickMs: 16,
  mouseThreshold: 40,
  minMovementForImage: 5,
  inDuration: 600,
  outDuration: 800,
  maxRotationFactor: 3,
  baseRotation: 30,
  speedSmoothingFactor: 0.25,
  minImageSize: 260,
  maxImageSize: 340,
  staggerOut: 40,
};

const POOL_CAP = 24;

export function ImageTrailEffect({ images, className, config, children }: TrailWrapperProps) {
  const cfg = useMemo(() => ({ ...DEFAULTS, ...(config || {}) }), [config]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const state = useRef({
    imageIndex: 0,
    isPointerIn: false,
    isMoving: false,
    lastMouseX: 0,
    lastMouseY: 0,
    mouseX: 0,
    mouseY: 0,
    prevMouseX: 0,
    prevMouseY: 0,
    lastMoveTime: Date.now(),
    lastRemovalTime: 0,
    smoothedSpeed: 0,
    maxSpeed: 0.5,
    raf: 0 as number,
    removalQueue: [] as { el: HTMLImageElement; rotation: number }[],
  });

  const trail = useRef<Array<{
    el: HTMLImageElement;
    rotation: number;
    removeAt: number;
  }>>([]);

  const pool = useRef<HTMLImageElement[]>([]);

  const getNextImageSrc = () => {
    const idx = state.current.imageIndex % images.length;
    state.current.imageIndex = (state.current.imageIndex + 1) % images.length;
    return images[idx];
  };

  const hasMovedEnough = () => {
    const dx = state.current.mouseX - state.current.lastMouseX;
    const dy = state.current.mouseY - state.current.lastMouseY;
    return Math.hypot(dx, dy) > cfg.mouseThreshold;
  };

  const hasMovedAtAll = () => {
    const dx = state.current.mouseX - state.current.prevMouseX;
    const dy = state.current.mouseY - state.current.prevMouseY;
    return Math.hypot(dx, dy) > cfg.minMovementForImage;
  };

  const calcSpeed = () => {
    const now = Date.now();
    const dt = now - state.current.lastMoveTime;
    if (dt <= 0) return state.current.smoothedSpeed;
    const dist = Math.hypot(
      state.current.mouseX - state.current.prevMouseX,
      state.current.mouseY - state.current.prevMouseY
    );
    const raw = dist / dt;
    if (raw > state.current.maxSpeed) state.current.maxSpeed = raw;
    const norm = Math.min(raw / (state.current.maxSpeed || 0.5), 1);
    state.current.smoothedSpeed =
      state.current.smoothedSpeed * (1 - cfg.speedSmoothingFactor) +
      norm * cfg.speedSmoothingFactor;
    state.current.lastMoveTime = now;

    return state.current.smoothedSpeed;
  };

  const getPooledImage = () => {
    const el = pool.current.pop();
    if (el) return el;
    const img = document.createElement("img");
    img.className = "pointer-events-none select-none absolute will-change-transform";
    img.style.transformOrigin = "50% 50%";
    img.draggable = false;
    return img;
  };

  const recycleImage = (img: HTMLImageElement) => {
    gsap.killTweensOf(img);
    img.remove();
    img.removeAttribute("style");
    img.className = "pointer-events-none select-none absolute will-change-transform";
    if (pool.current.length < POOL_CAP) pool.current.push(img);
  };

  const isInsideContainer = (clientX: number, clientY: number) => {
    const node = containerRef.current;
    if (!node) return false;
    const rect = node.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  };

  const spawnTrail = (speed = 0.5) => {
    const node = containerRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = state.current.mouseX - rect.left;
    const y = state.current.mouseY - rect.top;

    const size = Math.round(cfg.minImageSize + (cfg.maxImageSize - cfg.minImageSize) * speed);
    const rotFactor = 1 + speed * (cfg.maxRotationFactor - 1);
    const rot = (Math.random() - 0.5) * cfg.baseRotation * rotFactor;

    const img = getPooledImage();
    img.src = getNextImageSrc();
    img.width = size;
    img.height = size;

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.transform = `translate(-50%, -50%) scale(0)`;

    node.appendChild(img);

    gsap.set(img, { rotation: rot });
    gsap.to(img, {
      scale: 1,
      duration: cfg.inDuration / 1000,
      ease: "power2.out",
    });
    trail.current.push({ el: img, rotation: rot, removeAt: Date.now() + cfg.imageLifespan });
  };

  const tryEmit = () => {
    if (!state.current.isPointerIn) return;
    if (hasMovedEnough() && hasMovedAtAll()) {
      state.current.lastMouseX = state.current.mouseX;
      state.current.lastMouseY = state.current.mouseY;
      const s = calcSpeed();
      spawnTrail(s);
      state.current.prevMouseX = state.current.mouseX;
      state.current.prevMouseY = state.current.mouseY;
    }
  };

  const cullOld = () => {
    const now = Date.now();

    if (now - state.current.lastRemovalTime < cfg.removalTickMs) return;
    if (!trail.current.length) return;

    const expired = trail.current.filter((t) => now >= t.removeAt);
    if (!expired.length) return;

    expired.forEach((item, i) => {
      const { el } = item;
      gsap.to(el, {
        duration: cfg.outDuration / 1000,
        scale: 0,
        ease: "power4.inOut",
        delay: (i * cfg.staggerOut) / 1000,
        onComplete: () => recycleImage(el),
      });
    });

    trail.current = trail.current.filter((t) => now < t.removeAt);
    state.current.lastRemovalTime = now;
  };

  const tick = () => {
    if (state.current.isMoving) tryEmit();
    cullOld();
    state.current.raf = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const onPointerMove = (e: PointerEvent) => {
      state.current.prevMouseX = state.current.mouseX;
      state.current.prevMouseY = state.current.mouseY;
      state.current.mouseX = e.clientX;
      state.current.mouseY = e.clientY;
      state.current.isPointerIn = isInsideContainer(e.clientX, e.clientY);
      if (state.current.isPointerIn) {
        state.current.isMoving = true;
        window.clearTimeout((onPointerMove as any)._idle);
        (onPointerMove as any)._idle = window.setTimeout(() => (state.current.isMoving = false), 100);
      }
    };

    const onPointerEnter = (e: PointerEvent) => {
      state.current.isPointerIn = true;
      state.current.mouseX = e.clientX;
      state.current.mouseY = e.clientY;
      state.current.lastMouseX = e.clientX;
      state.current.lastMouseY = e.clientY;
      state.current.prevMouseX = e.clientX;
      state.current.prevMouseY = e.clientY;
      state.current.lastMoveTime = Date.now();
    };

    const onPointerLeave = () => {
      state.current.isPointerIn = false;
      state.current.isMoving = false;
    };

    node.addEventListener("pointermove", onPointerMove, { passive: true });
    node.addEventListener("pointerenter", onPointerEnter, { passive: true });
    node.addEventListener("pointerleave", onPointerLeave, { passive: true });

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const t = e.touches[0];
      const dx = Math.abs(t.clientX - state.current.prevMouseX);
      const dy = Math.abs(t.clientY - state.current.prevMouseY);
      if (dy > dx) return;

      state.current.prevMouseX = state.current.mouseX;
      state.current.prevMouseY = state.current.mouseY;
      state.current.mouseX = t.clientX;
      state.current.mouseY = t.clientY;
      state.current.isPointerIn = isInsideContainer(t.clientX, t.clientY);
      if (state.current.isPointerIn) {
        state.current.isMoving = true;
      }
    };

    node.addEventListener("touchmove", onTouchMove, { passive: true });

    state.current.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(state.current.raf);
      node.removeEventListener("pointermove", onPointerMove as any);
      node.removeEventListener("pointerenter", onPointerEnter as any);
      node.removeEventListener("pointerleave", onPointerLeave as any);
      node.removeEventListener("touchmove", onTouchMove as any);

      trail.current.forEach(({ el }) => {
        gsap.killTweensOf(el);
        el.remove();
      });
      trail.current = [];
    };
  }, [cfg]);

  const wrapperClass = `relative overflow-hidden ${className ?? ""}`.trim();

  return (
    <div ref={containerRef} className={wrapperClass}>
      {children}
    </div>
  );
}
