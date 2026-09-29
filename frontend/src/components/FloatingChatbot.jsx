import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles } from 'lucide-react';

export default function FloatingChatbot({ setActivePage, activePage }) {
  // If user is already on the AI Strategy page, don't show the button
  if (activePage === 'agent') return null;

  // Track button position (absolute pixel coordinates from top-left)
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  // References for drag calculation
  const dragStartRef = useRef({ x: 0, y: 0 }); // Pointer start pos
  const btnStartRef = useRef({ x: 0, y: 0 });  // Button start pos
  const isDraggingRef = useRef(false);
  const pointerDownRef = useRef(false);
  const btnRef = useRef(null);

  // Calculate safe boundary margins and button size
  const getBounds = () => {
    if (typeof window === 'undefined') {
      return { minX: 16, maxX: 300, minY: 70, maxY: 600, btnSize: 64 };
    }
    const isMobile = window.innerWidth < 640;
    const btnSize = isMobile ? 64 : 56; // Larger 64px on mobile
    const minX = 14;
    const maxX = Math.max(minX, window.innerWidth - btnSize - 14);
    const minY = 68; // Safe area below top navbar
    // Above mobile sticky bottom navigation bar (~76px) or desktop bottom (~24px)
    const maxY = Math.max(minY, isMobile ? window.innerHeight - btnSize - 78 : window.innerHeight - btnSize - 24);
    return { minX, maxX, minY, maxY, btnSize };
  };

  // Initialize position to bottom-right corner on mount
  useEffect(() => {
    const { maxX, maxY } = getBounds();
    setPosition({ x: maxX, y: maxY });

    const handleResize = () => {
      if (!isDraggingRef.current) {
        setPosition(prev => {
          if (!prev) return prev;
          const { minX, maxX: newMaxX, minY, maxY: newMaxY } = getBounds();
          return {
            x: Math.min(newMaxX, Math.max(minX, prev.x)),
            y: Math.min(newMaxY, Math.max(minY, prev.y)),
          };
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Snap to the nearest of the 4 sides of the screen (Left, Right, Top, Bottom)
  const snapToNearestEdge = (currentX, currentY) => {
    const { minX, maxX, minY, maxY } = getBounds();

    // Clamp current position within bounds
    const clampedX = Math.min(maxX, Math.max(minX, currentX));
    const clampedY = Math.min(maxY, Math.max(minY, currentY));

    // Distances to the 4 edges
    const distLeft = clampedX - minX;
    const distRight = maxX - clampedX;
    const distTop = clampedY - minY;
    const distBottom = maxY - clampedY;

    const minDist = Math.min(distLeft, distRight, distTop, distBottom);

    let targetX = clampedX;
    let targetY = clampedY;

    if (minDist === distLeft) {
      targetX = minX; // Snap to Left edge
    } else if (minDist === distRight) {
      targetX = maxX; // Snap to Right edge
    } else if (minDist === distTop) {
      targetY = minY; // Snap to Top edge
    } else {
      targetY = maxY; // Snap to Bottom edge
    }

    return { x: targetX, y: targetY };
  };

  // --- TOUCH HANDLERS (Mobile) ---
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    pointerDownRef.current = true;
    isDraggingRef.current = false;
    setHasMoved(false);

    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    btnStartRef.current = { x: position?.x ?? 0, y: position?.y ?? 0 };
  };

  const handleTouchMove = (e) => {
    if (!pointerDownRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    const dist = Math.hypot(dx, dy);

    // If movement exceeds 6px, start dragging and prevent browser scroll
    if (dist > 6) {
      if (!isDraggingRef.current) {
        isDraggingRef.current = true;
        setIsDragging(true);
        setHasMoved(true);
      }
      e.preventDefault(); // Prevent page scrolling during bot drag

      const { minX, maxX, minY, maxY } = getBounds();
      const newX = Math.min(maxX, Math.max(minX, btnStartRef.current.x + dx));
      const newY = Math.min(maxY, Math.max(minY, btnStartRef.current.y + dy));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    if (!pointerDownRef.current) return;
    pointerDownRef.current = false;

    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      // Snap to nearest of the 4 borders
      setPosition(prev => (prev ? snapToNearestEdge(prev.x, prev.y) : prev));
    } else {
      // Pure tap without drag -> Open AI Strategist Studio
      if (setActivePage) {
        setActivePage('agent');
      }
    }
  };

  // --- MOUSE HANDLERS (Desktop / PC) ---
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    pointerDownRef.current = true;
    isDraggingRef.current = false;
    setHasMoved(false);

    dragStartRef.current = { x: e.clientX, y: e.clientY };
    btnStartRef.current = { x: position?.x ?? 0, y: position?.y ?? 0 };

    const handleMouseMove = (moveEvent) => {
      if (!pointerDownRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.x;
      const dy = moveEvent.clientY - dragStartRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 5) {
        if (!isDraggingRef.current) {
          isDraggingRef.current = true;
          setIsDragging(true);
          setHasMoved(true);
        }
        const { minX, maxX, minY, maxY } = getBounds();
        const newX = Math.min(maxX, Math.max(minX, btnStartRef.current.x + dx));
        const newY = Math.min(maxY, Math.max(minY, btnStartRef.current.y + dy));
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      pointerDownRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        setPosition(prev => (prev ? snapToNearestEdge(prev.x, prev.y) : prev));
      } else {
        // Pure click without drag
        if (setActivePage) {
          setActivePage('agent');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!position) return null;

  return (
    <div
      ref={btnRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
        transition: isDragging ? 'none' : 'left 0.35s cubic-bezier(0.25, 1, 0.5, 1), top 0.35s cubic-bezier(0.25, 1, 0.5, 1), transform 0.2s ease',
        zIndex: 50,
      }}
      className={`group select-none ${isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:scale-105'}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {/* Tooltip visible on desktop hover when not dragging */}
      <div className={`hidden sm:flex absolute right-full mr-3 top-1/2 -translate-y-1/2 items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-900/95 border border-slate-700/60 dark:border-blue-500/30 text-white text-xs font-semibold shadow-xl backdrop-blur-md transition-opacity duration-200 pointer-events-none whitespace-nowrap ${
        isDragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        <span>AI Strategist (Tap to Open • Drag to Move)</span>
      </div>

      {/* Floating Corner AI Button: Increased size on mobile (w-16 h-16 / 64px) */}
      <button
        type="button"
        className="relative h-16 w-16 sm:h-14 sm:w-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 border-2 border-white dark:border-blue-400/70 select-none active:scale-95 transition-transform"
        title="Open AI Strategist Studio (Drag to attach to any edge)"
        aria-label="Open AI Strategist Studio"
      >
        {/* Note: Green notification dot removed per user requirement */}
        
        {/* Subtle inner glowing aura */}
        <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Larger Bot Icon on mobile (h-8 w-8) and sm:h-7 sm:w-7 */}
        <Bot className="h-8 w-8 sm:h-7 sm:w-7 text-white drop-shadow-md group-hover:rotate-12 transition-transform pointer-events-none" />

        {/* Sparkles detail at the corner */}
        <Sparkles className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-amber-300 absolute bottom-1.5 right-1.5 drop-shadow pointer-events-none" />
      </button>
    </div>
  );
}
