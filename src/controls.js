import * as THREE from 'three';
import { soundManager } from './audio.js';

export class FirstPersonController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    // Orientation
    this.yaw = 0;
    this.pitch = 0;
    this.moveSpeed = 7.5; // meters per second
    this.stepTimer = 0;

    // Movement state
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.boostSpeed = 1.0;

    // Touch tracking
    this.joystickTouchId = null;
    this.lookTouchId = null;
    this.joystickCenter = { x: 0, y: 0 };
    this.joystickDelta = { x: 0, y: 0 };
    this.lastTouchLook = { x: 0, y: 0 };

    // Mouse tracking
    this.isMouseDown = false;
    this.lastMouse = { x: 0, y: 0 };

    // Auto-pilot / Guidance mode for kids
    this.autoTarget = null;
    this.isAutoWalking = false;

    this.setupKeyboard();
    this.setupMouse();
    this.setupTouch();
  }

  setupKeyboard() {
    window.addEventListener('keydown', e => {
      soundManager.unlockAudio();
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.moveForward = true;
          this.isAutoWalking = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.moveBackward = true;
          this.isAutoWalking = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.moveLeft = true;
          this.isAutoWalking = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.moveRight = true;
          this.isAutoWalking = false;
          break;
      }
    });

    window.addEventListener('keyup', e => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.moveForward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.moveBackward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.moveLeft = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.moveRight = false;
          break;
      }
    });
  }

  setupMouse() {
    this.domElement.addEventListener('mousedown', e => {
      // If clicking interactive UI buttons, ignore
      if (e.target.closest('.interactive-ui') || e.target.closest('.stage-panel') || e.target.closest('button') || e.target.closest('input')) return;
      soundManager.unlockAudio();
      this.isMouseDown = true;
      this.lastMouse.x = e.clientX;
      this.lastMouse.y = e.clientY;
    });

    window.addEventListener('mousemove', e => {
      if (!this.isMouseDown) return;
      const dx = e.clientX - this.lastMouse.x;
      const dy = e.clientY - this.lastMouse.y;
      this.lastMouse.x = e.clientX;
      this.lastMouse.y = e.clientY;

      const sensitivity = 0.0035;
      this.yaw -= dx * sensitivity;
      this.pitch -= dy * sensitivity;
      this.pitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.pitch));
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
  }

  setupTouch() {
    const joystickArea = document.getElementById('touch-joystick-area');
    const joystickThumb = document.getElementById('touch-joystick-thumb');

    // Virtual Joystick on Mobile
    if (joystickArea) {
      joystickArea.addEventListener('touchstart', e => {
        e.preventDefault();
        soundManager.unlockAudio();
        const touch = e.changedTouches[0];
        this.joystickTouchId = touch.identifier;
        const rect = joystickArea.getBoundingClientRect();
        this.joystickCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        this.updateJoystick(touch.clientX, touch.clientY, joystickThumb);
      }, { passive: false });

      joystickArea.addEventListener('touchmove', e => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          if (touch.identifier === this.joystickTouchId) {
            this.updateJoystick(touch.clientX, touch.clientY, joystickThumb);
          }
        }
      }, { passive: false });

      const endJoystick = e => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === this.joystickTouchId) {
            this.joystickTouchId = null;
            this.joystickDelta = { x: 0, y: 0 };
            if (joystickThumb) {
              joystickThumb.style.transform = 'translate(0px, 0px)';
            }
          }
        }
      };

      joystickArea.addEventListener('touchend', endJoystick);
      joystickArea.addEventListener('touchcancel', endJoystick);
    }

    // Touch look on the right half of screen
    window.addEventListener('touchstart', e => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.target.closest('.interactive-ui') || touch.target.closest('.stage-panel') || touch.target.closest('button') || touch.target.closest('input')) continue;
        if (touch.clientX > window.innerWidth * 0.4 && this.lookTouchId === null) {
          this.lookTouchId = touch.identifier;
          this.lastTouchLook = { x: touch.clientX, y: touch.clientY };
          soundManager.unlockAudio();
        }
      }
    });

    window.addEventListener('touchmove', e => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.lookTouchId) {
          const dx = touch.clientX - this.lastTouchLook.x;
          const dy = touch.clientY - this.lastTouchLook.y;
          this.lastTouchLook = { x: touch.clientX, y: touch.clientY };

          const touchSens = 0.005;
          this.yaw -= dx * touchSens;
          this.pitch -= dy * touchSens;
          this.pitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.pitch));
        }
      }
    });

    const endLook = e => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.lookTouchId) {
          this.lookTouchId = null;
        }
      }
    };
    window.addEventListener('touchend', endLook);
    window.addEventListener('touchcancel', endLook);
  }

  updateJoystick(cx, cy, thumbEl) {
    const maxDist = 45;
    let dx = cx - this.joystickCenter.x;
    let dy = cy - this.joystickCenter.y;
    const dist = Math.hypot(dx, dy);

    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }

    this.joystickDelta = {
      x: dx / maxDist,
      y: dy / maxDist
    };

    if (thumbEl) {
      thumbEl.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  }

  // Kid auto-walk guide to smoothly glide to next waypoint
  walkToTarget(targetVec) {
    this.autoTarget = targetVec.clone();
    this.isAutoWalking = true;
  }

  update(delta, boundsChecker) {
    // 1. Update Camera Rotation (Yaw + Pitch)
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.x = this.pitch;
    euler.y = this.yaw;
    this.camera.quaternion.setFromEuler(euler);

    // 2. Handle Auto-walking towards waypoint if active
    let isMoving = false;
    const currentPos = this.camera.position;

    if (this.isAutoWalking && this.autoTarget) {
      const dx = this.autoTarget.x - currentPos.x;
      const dz = this.autoTarget.z - currentPos.z;
      const dist = Math.hypot(dx, dz);

      // Smoothly steer yaw towards target
      const targetYaw = Math.atan2(-dx, -dz);
      // Angular difference with wrap
      let angleDiff = targetYaw - this.yaw;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      this.yaw += angleDiff * Math.min(1, delta * 3.5);

      if (dist > 1.2) {
        const step = this.moveSpeed * this.boostSpeed * delta;
        currentPos.x += (dx / dist) * Math.min(step, dist);
        currentPos.z += (dz / dist) * Math.min(step, dist);
        isMoving = true;
      } else {
        this.isAutoWalking = false;
        this.autoTarget = null;
      }
    } else {
      // 3. User manual movement vector
      const moveVec = new THREE.Vector3();

      // Keyboard
      if (this.moveForward) moveVec.z -= 1;
      if (this.moveBackward) moveVec.z += 1;
      if (this.moveLeft) moveVec.x -= 1;
      if (this.moveRight) moveVec.x += 1;

      // Virtual Joystick
      if (Math.abs(this.joystickDelta.y) > 0.1) {
        moveVec.z += this.joystickDelta.y;
      }
      if (Math.abs(this.joystickDelta.x) > 0.1) {
        moveVec.x += this.joystickDelta.x;
      }

      if (moveVec.lengthSq() > 0.001) {
        moveVec.normalize();
        isMoving = true;

        // Apply yaw rotation to move vector
        moveVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

        const step = this.moveSpeed * this.boostSpeed * delta;
        const newX = currentPos.x + moveVec.x * step;
        const newZ = currentPos.z + moveVec.z * step;

        // Bounds / collision checking
        if (boundsChecker) {
          const validated = boundsChecker(newX, newZ, currentPos);
          currentPos.x = validated.x;
          currentPos.z = validated.z;
        } else {
          currentPos.x = newX;
          currentPos.z = newZ;
        }
      }
    }

    // 4. Footsteps & Natural Head Bobbing
    if (isMoving) {
      this.stepTimer += delta * 9 * this.boostSpeed;
      // Eye level is 1.6m + gentle 4cm sine bobbing
      this.camera.position.y = 1.6 + Math.sin(this.stepTimer) * 0.04;

      if (Math.sin(this.stepTimer) < -0.95) {
        soundManager.playStepSound();
      }
    } else {
      this.camera.position.y = 1.6;
    }
  }
}
