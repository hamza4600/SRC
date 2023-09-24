import {
	MathUtils,
	Spherical,
	Vector3,
	Quaternion,
	Euler,
	Raycaster,
	EventDispatcher
} from 'three';

const _lookDirection = new Vector3();
const _spherical = new Spherical();
const _target = new Vector3();
const _euler = new Euler(0, 0, 0, 'YXZ');
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };
const down = new Vector3(0, -1, 0);
const raycaster = new Raycaster();

raycaster.layers.set(2);
raycaster.near = 0.01;
raycaster.far = 1000;

class CustomControls extends EventDispatcher {
	constructor(object, domElement, scene, isMobile, showroomId, history) {
		super()
		this.scene = scene;
		this.isMobile = isMobile;
		this.history = history;
		this.showroomId = showroomId;
		this.object = object;
		this.domElement = domElement;
		this.initialPosition = this.object.position.clone();
		this.initialRotation = this.object.rotation.clone();
		this.dispatchSetSelectedModel = () => { };
		this.dispatchSetPointerLock = () => { };
		this.dispatchSetJoystickPresent = () => { };
		this.dispatchSetJoystickPosition = () => { };
		this.dispatchSetJoystickDirection = () => { };

		this.enabled = true;
		this.movementSpeed = 2.5;
		this.lookSpeed = 0.005;
		this.isLocked = false;
		this.touchMode = 'rotate';

		this.lookVertical = true;

		this.activeLook = true;

		this.heightSpeed = false;
		this.heightCoef = 1.0;
		this.heightMin = 0.0;
		this.heightMax = 1.0;

		this.constrainVertical = false;
		this.verticalMin = 0;
		this.verticalMax = Math.PI;

		this.mouseDragOn = false;

		this.mouseX = 0;
		this.mouseY = 0;

		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;

		this.viewHalfX = 0;
		this.viewHalfY = 0;

		let lon = 0;
		let lat = lon;

		this.onPointerUp = (event) => {
			const ndcX = event.clientX / this.domElement.offsetWidth * 2 - 1;
			const ndcY = - (event.clientY / this.domElement.offsetHeight) * 2 + 1;
			if ((isMobile || (event.timeStamp - this.pointerLockChangeTimestamp) > 1000) && (!isMobile || !this.dragHappened)) {
				this.object.updateMatrixWorld()
				raycaster.setFromCamera({ x: this.isMobile ? ndcX : 0, y: this.isMobile ? ndcY : 0 }, this.object);
				const intersections = raycaster.intersectObjects(this.scene.children, true);
				if (intersections[0]) {
					if (intersections[0].object.userData.model) {
						this.dispatchSetSelectedModel(intersections[0].object.userData.model.id);
						!this.isMobile && this.dispatchSetPointerLock(false);
					}
					if (intersections[0].object.userData.spot) {
						// eslint-disable-next-line no-restricted-globals
						this.history.push(`/${showroomId}/${intersections[0].object.userData.spot.toSpotID}`);
					}
				}
			}

			this.dragHappened = false;
		}

		this.domElement.addEventListener('pointerup', this.onPointerUp);

		this.handleResize = function () {
			if (this.domElement === document) {
				this.viewHalfX = window.innerWidth / 2;
				this.viewHalfY = window.innerHeight / 2;
			} else {
				this.viewHalfX = this.domElement.offsetWidth / 2;
				this.viewHalfY = this.domElement.offsetHeight / 2;
			}
		};

		this.onMouseDown = (event) => {

			if (this.domElement !== document) {

				this.domElement.focus();

			}

			if (this.activeLook) {
				switch (event.button) {

					// case 0: this.moveForward = true; break;
					// case 2: this.moveBackward = true; break;
					default: break;
				}

			}

			this.mouseDragOn = true;

		};

		this.onMouseUp = (event) => {
			if (this.activeLook) {
				switch (event.button) {

					// case 0: this.moveForward = false; break;
					// case 2: this.moveBackward = false; break;
					default: break;
				}
			}

			this.mouseDragOn = false;

		};

		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians
		const scope = this;

		this.onMouseMove = (event) => {
			if (this.domElement === document) {
				this.mouseX = event.pageX - this.viewHalfX;
				this.mouseY = event.pageY - this.viewHalfY;
			} else {
				this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
				this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
			}
			if (this.isLocked === true) {
				const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
				const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

				_euler.setFromQuaternion(object.quaternion);

				_euler.y -= movementX * 0.003;
				_euler.x -= movementY * 0.003;

				_euler.x = Math.max(Math.PI / 2 - scope.maxPolarAngle, Math.min(Math.PI / 2 - scope.minPolarAngle, _euler.x));

				object.quaternion.setFromEuler(_euler);
			}
		};
		let lastPageX = null;
		let lastPageY = null;
		let startTouchPageX = null;
		let startTouchPageY = null;

		this.onTouchMove = (event) => {
			const touch = event.touches[0];
			if (this.touchMode === 'move') {
				const movementX = touch.pageX - startTouchPageX;
				const movementY = touch.pageY - startTouchPageY;
				const amp = Math.sqrt(Math.pow(movementX, 2) + Math.pow(movementY, 2));
				if (amp > 3) { this.dragHappened = true; }

				this.dispatchSetJoystickDirection({ x: movementX / amp, y: movementY / amp });
				this.moveForward = (movementY < 0);
				this.moveBackward = (movementY > 0);
				this.moveLeft = (movementX < 0);
				this.moveRight = (movementX > 0);
			} else {
				_euler.setFromQuaternion(object.quaternion);
				const movementX = touch.pageX - (lastPageX || touch.pageX);
				const movementY = touch.pageY - (lastPageY || touch.pageY);
				const amp = Math.sqrt(Math.pow(movementX, 2) + Math.pow(movementY, 2));
				if (amp > 3) { this.dragHappened = true; }

				_euler.y -= movementX * 0.002;
				_euler.x -= movementY * 0.003;

				_euler.x = Math.max(Math.PI / 2 - scope.maxPolarAngle, Math.min(Math.PI / 2 - scope.minPolarAngle, _euler.x));

				object.quaternion.setFromEuler(_euler);
				lastPageX = touch.pageX;
				lastPageY = touch.pageY;
			}
		}

		this.onTouchStart = (event) => {
			event.preventDefault();
			this.dragHappened = false;

			const touch = event.touches[0];
			startTouchPageX = touch.pageX;
			startTouchPageY = touch.pageY;

			if (this.domElement.width < this.domElement.height) {
				if (touch.pageY > this.domElement.offsetHeight * 0.67) {
					this.touchMode = 'move';
					this.dispatchSetJoystickPosition({ x: touch.pageX, y: touch.pageY });
					this.dispatchSetJoystickDirection({ x: 0, y: 0 });
					this.dispatchSetJoystickPresent(true);
				} else {
					this.touchMode = 'rotate';
				}
			} else {
				if (touch.pageX < this.domElement.offsetWidth * 0.33) {
					this.touchMode = 'move';
					this.dispatchSetJoystickPosition({ x: touch.pageX, y: touch.pageY });
					this.dispatchSetJoystickDirection({ x: 0, y: 0 });
					this.dispatchSetJoystickPresent(true);
				} else {
					this.touchMode = 'rotate';
				}
			}
		}

		this.onTouchEnd = () => {
			this.dispatchSetJoystickPresent(false)
			lastPageX = null;
			lastPageY = null;
			startTouchPageX = null;
			startTouchPageY = null;
			this.moveForward = false;
			this.moveBackward = false;
			this.moveLeft = false;
			this.moveRight = false;
		}

		this.onKeyDown = (event) => {
			switch (event.code) {
				case 'ArrowUp':
				case 'KeyW': this.moveForward = true; break;

				case 'ArrowLeft':
				case 'KeyA': this.moveLeft = true; break;

				case 'ArrowDown':
				case 'KeyS': this.moveBackward = true; break;

				case 'ArrowRight':
				case 'KeyD': this.moveRight = true; break;
				default: break;
			}
		};

		this.onKeyUp = (event) => {
			switch (event.code) {
				case 'ArrowUp':
				case 'KeyW': this.moveForward = false; break;

				case 'ArrowLeft':
				case 'KeyA': this.moveLeft = false; break;

				case 'ArrowDown':
				case 'KeyS': this.moveBackward = false; break;

				case 'ArrowRight':
				case 'KeyD': this.moveRight = false; break;
				default: break;
			}
		};

		this.lookAt = function (x, y, z) {
			if (x.isVector3) {
				_target.copy(x);
			} else {
				_target.set(x, y, z);
			}

			this.object.lookAt(_target);

			setOrientation(this);

			return this;
		};

		function onPointerlockChange(e) {
			scope.pointerLockChangeTimestamp = e.timeStamp;
			if (scope.domElement.ownerDocument.pointerLockElement === scope.domElement) {
				scope.dispatchEvent(_lockEvent);
				scope.isLocked = true;

				window.addEventListener('keydown', scope.onKeyDown, false);
				window.addEventListener('keyup', scope.onKeyUp, false);
			} else {
				scope.dispatchEvent(_unlockEvent);
				scope.dispatchSetPointerLock(false);
				scope.isLocked = false;

				window.removeEventListener('keydown', scope.onKeyDown, false);
				window.removeEventListener('keyup', scope.onKeyUp, false);
			}
		}

		function onPointerlockError() {
			console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');
		}

		this.connect = function () {
			if (!scope.isMobile) {
				scope.domElement.ownerDocument.addEventListener('pointerlockchange', onPointerlockChange);
				scope.domElement.ownerDocument.addEventListener('pointerlockerror', onPointerlockError);
			}
		};

		this.disconnect = function () {
			if (!scope.isMobile) {
				scope.domElement.ownerDocument.removeEventListener('pointerlockchange', onPointerlockChange);
				scope.domElement.ownerDocument.removeEventListener('pointerlockerror', onPointerlockError);
			}
		};

		this.dispose = function () {
			this.disconnect();
		};

		this.update = function () {
			const v3 = new Vector3();
			const q = new Quaternion();
			return function (delta, isPointerLocked, camera) {
				scope.object = camera;
				if (scope.enabled === false) return;

				if (!scope.isMobile) {
					if (isPointerLocked && !scope.isLocked) {
						scope.domElement.requestPointerLock();
					}

					if (!isPointerLocked && scope.isLocked) {
						document.exitPointerLock();
					}
				}

				const actualMoveSpeed = delta * scope.movementSpeed;
				// const prevPosition = scope.object.position.clone()
				v3.set(0, 0, -actualMoveSpeed);
				q.set(0, scope.object.quaternion.y, 0, scope.object.quaternion.w);
				if (scope.moveForward) scope.object.position.add(v3.clone().applyQuaternion(q));
				if (scope.moveBackward) scope.object.position.add(v3.clone().multiplyScalar(-1).applyQuaternion(q));

				if (scope.moveLeft) scope.object.translateX(- actualMoveSpeed);
				if (scope.moveRight) scope.object.translateX(actualMoveSpeed);

				let actualLookSpeed = delta * scope.lookSpeed;

				if (!scope.activeLook) {
					actualLookSpeed = 0;
				}

				let verticalLookRatio = 1;

				if (scope.constrainVertical) {
					verticalLookRatio = Math.PI / (scope.verticalMax - scope.verticalMin);
				}

				lon -= scope.mouseX * actualLookSpeed;
				if (scope.lookVertical) lat -= scope.mouseY * actualLookSpeed * verticalLookRatio;

				lat = Math.max(- 85, Math.min(85, lat));

				scope.object.position.y = scope.initialPosition.y
				if (scope.moveForward || scope.moveBackward || scope.moveLeft || scope.moveRight) {
					raycaster.set(scope.object.position.clone(), down);
					// const intersections = raycaster.intersectObjects(scope.scene.children, true)
					// if (!intersections.map((int) => int.object).filter((obj) => obj.name === 'collisionFloor').length) {
					// 	scope.object.position.copy(prevPosition);
					// }
				}
			};

		}();

		this.dispose = () => {
			this.domElement.removeEventListener('contextmenu', contextmenu);
			this.domElement.removeEventListener('mousedown', this.onMouseDown);
			this.domElement.removeEventListener('mousemove', this.onMouseMove);
			this.domElement.removeEventListener('mouseup', this.onMouseUp);

			window.removeEventListener('keydown', this.onKeyDown);
			window.removeEventListener('keyup', this.onKeyUp);

			this.domElement.removeEventListener('pointerup', this.onPointerUp);
		};

		if (!this.isMobile) {
			this.domElement.addEventListener('contextmenu', contextmenu);
			this.domElement.addEventListener('mousemove', this.onMouseMove);
			this.domElement.addEventListener('mousedown', this.onMouseDown);
			this.domElement.addEventListener('mouseup', this.onMouseUp);
		} else {
			this.domElement.addEventListener('touchstart', this.onTouchStart);
			this.domElement.addEventListener('touchmove', this.onTouchMove);
			this.domElement.addEventListener('touchend', this.onTouchEnd);
		}

		function setOrientation(controls) {
			const quaternion = controls.object.quaternion;

			_lookDirection.set(0, 0, - 1).applyQuaternion(quaternion);
			_spherical.setFromVector3(_lookDirection);

			lat = 90 - MathUtils.radToDeg(_spherical.phi);
			lon = MathUtils.radToDeg(_spherical.theta);
		}

		this.handleResize();

		setOrientation(this);

		this.connect()
	}
}

function contextmenu(event) {
	event.preventDefault();
}

export { CustomControls };
