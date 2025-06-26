import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import React from 'react';
import { View, Text } from 'react-native';

class OrientationVisualize extends React.Component {
    yprToUnitVector(roll, pitch, yaw) {

    // Calculate direction vector after applying roll, pitch, yaw (ZYX order)
    // Start with forward vector (0, 0, 1)
    // Apply roll (X), then pitch (Y), then yaw (Z)
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const cr = Math.cos(roll);
    const sr = Math.sin(roll);

    // ZYX intrinsic rotation
    const x = cy * sp * cr + sy * sr;
    const y = sy * sp * cr - cy * sr;
    const z = cp * cr;

    // Normalize
    const mag = Math.sqrt(x * x + y * y + z * z);
    return {
        x: x*3 / mag,
        y: y*3 / mag,
        z: z*3 / mag,
    };
    }
    render() {
        let temp = this.yprToUnitVector(
            this.props.y, this.props.x, this.props.z
        );
        return (
            <VectorVisualize {...temp}></VectorVisualize>
        );
    }
}
class MagnitudeVisualize extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Orientation Visualize Component</Text>
            </View>
        );
    }
}
 class VectorVisualize extends React.Component {
  // === CONSTANT PARAMETERS ===
  static CANVAS_SIZE = 115;
  static AXIS_LENGTH = 3.4;
  static AXIS_LINE_WIDTH = 2.5;
  static ARROW_COLOR = 0x00ffff;
  static ARROW_HEAD_LENGTH = 0.4;
  static ARROW_HEAD_WIDTH = 0.5;
  static ARROW_SHAFT_RADIUS = 0.12;
  static CAMERA_FOV = 75;
  static CAMERA_NEAR = 0.1;
  static CAMERA_FAR = 1000;
  static CAMERA_POSITION = { x: 1.5*1.1, y: 2*1.1, z: 2.5*1.1 };
  static CAMERA_Z_ROTATE = 0.8 * (Math.PI / 6); // 30 deg * 1.3
  static BG_COLOR = 0x222222;

  // Axis arrow head constants
  static AXIS_HEAD_LENGTH = 0.33;
  static AXIS_HEAD_WIDTH = 0.25;
  static X_AXIS_COLOR = 0xff0000;
  static Y_AXIS_COLOR = 0x00ff00;
  static Z_AXIS_COLOR = 0xffa500;

  _mounted = false;
  _frame = null;
  arrowHelper = null;
  arrowShaft = null;
  scene = null;
  camera = null;
  renderer = null;
  gl = null;

  componentWillUnmount() {
    this._mounted = false;
    if (this._frame) cancelAnimationFrame(this._frame);
  }

  componentDidUpdate(prevProps) {
    const { x, y, z } = this.props;
    if (
      prevProps.x !== x ||
      prevProps.y !== y ||
      prevProps.z !== z
    ) {
      this.updateVectorGraphics();
    }
  }

  updateVectorGraphics = () => {
    const { x = 1, y = 1, z = 1 } = this.props;
    const mag = Math.sqrt(x * x + y * y + z * z);
    if (this.arrowHelper && this.arrowShaft) {
     
        const dir = new THREE.Vector3(x, y, z).normalize();
        const length = Math.min(3, mag);
        const headLength = VectorVisualize.ARROW_HEAD_LENGTH;
        const headWidth = VectorVisualize.ARROW_HEAD_WIDTH;
        this.arrowHelper.setDirection(dir);
        this.arrowHelper.setLength(length, headLength, headWidth);

        // Update shaft geometry and position
        this.arrowShaft.scale.set(1, (length - headLength) / this.arrowShaft.geometry.parameters.height, 1);
        this.arrowShaft.position.copy(dir.clone().multiplyScalar((length - headLength) / 2));
        this.arrowShaft.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir
        );
        this.arrowHelper.visible = true;
        this.arrowShaft.visible = true;

      if (this.renderer && this.scene && this.camera && this.gl) {
        this.renderer.render(this.scene, this.camera);
        this.gl.endFrameEXP();
      }
    }
  };

  handleContextCreate = async (gl) => {
    this._mounted = true;
    this.gl = gl;
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(VectorVisualize.BG_COLOR);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      VectorVisualize.CAMERA_FOV,
      width / height,
      VectorVisualize.CAMERA_NEAR,
      VectorVisualize.CAMERA_FAR
    );
    // Set initial position
    this.camera.position.set(
      VectorVisualize.CAMERA_POSITION.x,
      VectorVisualize.CAMERA_POSITION.y,
      VectorVisualize.CAMERA_POSITION.z
    );

    // Rotate camera position 30 degrees (π/6 radians) around the z-axis
    const angle = VectorVisualize.CAMERA_Z_ROTATE;
    const _x = this.camera.position.x;
    const _y = this.camera.position.y;
    this.camera.position.x = _x * Math.cos(angle) - _y * Math.sin(angle);
    this.camera.position.y = _x * Math.sin(angle) + _y * Math.cos(angle);

    this.camera.lookAt(0, 0, 0);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    this.scene.add(light);

    // Draw axes for reference (both positive and negative directions)
    const axisLength = VectorVisualize.AXIS_LENGTH;

    // X axis (red)
    {
      const xGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-(VectorVisualize.AXIS_LENGTH + 0.33), 0, 0),
        new THREE.Vector3(VectorVisualize.AXIS_LENGTH, 0, 0),
      ]);
      const xMat = new THREE.LineBasicMaterial({ color: VectorVisualize.X_AXIS_COLOR, linewidth: VectorVisualize.AXIS_LINE_WIDTH });
      const xLine = new THREE.Line(xGeom, xMat);
      this.scene.add(xLine);

      const xHead = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(VectorVisualize.AXIS_LENGTH, 0, 0),
        0.001,
        VectorVisualize.X_AXIS_COLOR,
        VectorVisualize.AXIS_HEAD_LENGTH,
        VectorVisualize.AXIS_HEAD_WIDTH
      );
      this.scene.add(xHead);
    }

    // Y axis (green)
    {
      const yGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -(VectorVisualize.AXIS_LENGTH + 1.5), 0),
        new THREE.Vector3(0, VectorVisualize.AXIS_LENGTH, 0),
      ]);
      const yMat = new THREE.LineBasicMaterial({ color: VectorVisualize.Y_AXIS_COLOR, linewidth: VectorVisualize.AXIS_LINE_WIDTH });
      const yLine = new THREE.Line(yGeom, yMat);
      this.scene.add(yLine);

      const yHead = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, VectorVisualize.AXIS_LENGTH, 0),
        0.001,
        VectorVisualize.Y_AXIS_COLOR,
        VectorVisualize.AXIS_HEAD_LENGTH,
        VectorVisualize.AXIS_HEAD_WIDTH
      );
      this.scene.add(yHead);
    }

    // Z axis (orange)
    {
      const zGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, -(VectorVisualize.AXIS_LENGTH + 1.5)),
        new THREE.Vector3(0, 0, VectorVisualize.AXIS_LENGTH),
      ]);
      const zMat = new THREE.LineBasicMaterial({ color: VectorVisualize.Z_AXIS_COLOR, linewidth: VectorVisualize.AXIS_LINE_WIDTH });
      const zLine = new THREE.Line(zGeom, zMat);
      this.scene.add(zLine);

      const zHead = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, VectorVisualize.AXIS_LENGTH),
        0.001,
        VectorVisualize.Z_AXIS_COLOR,
        VectorVisualize.AXIS_HEAD_LENGTH,
        VectorVisualize.AXIS_HEAD_WIDTH
      );
      this.scene.add(zHead);
    }

    // Draw the vector as an arrow
    const { x = 1, y = 1, z = 1 } = this.props;
    const mag = Math.sqrt(x * x + y * y + z * z);
    const dir = new THREE.Vector3(x, y, z).normalize();
    const length = Math.sqrt(x * x + y * y + z * z) * 2;
    const hex = VectorVisualize.ARROW_COLOR;
    const headLength = VectorVisualize.ARROW_HEAD_LENGTH;
    const headWidth = VectorVisualize.ARROW_HEAD_WIDTH;

    this.arrowHelper = new THREE.ArrowHelper(
      dir,
      new THREE.Vector3(0, 0, 0),
      length,
      hex,
      headLength,
      headWidth
    );
    this.arrowHelper.visible = mag >= 0.5;
    this.scene.add(this.arrowHelper);

    // Add a thick shaft (cylinder) for the arrow
    const shaftRadius = VectorVisualize.ARROW_SHAFT_RADIUS;
    const shaftLength = length - headLength;
    const shaftGeometry = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftLength, 16);
    const shaftMaterial = new THREE.MeshBasicMaterial({ color: hex });
    this.arrowShaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    this.arrowShaft.position.copy(dir.clone().multiplyScalar(shaftLength / 2));
    this.arrowShaft.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir
    );
    this.arrowShaft.visible = mag >= 0.5;
    this.scene.add(this.arrowShaft);

    // Renderer
    this.renderer = new Renderer({ gl });
    this.renderer.setSize(width, height);
    gl.endFrameEXP();
  };

  render() {
    const { x, y, z } = this.props;

    return (
      <View style={{
        width: VectorVisualize.CANVAS_SIZE,
        height: VectorVisualize.CANVAS_SIZE,
        backgroundColor: '#e0e7ff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        overflow: 'hidden'
      }}>
        <GLView
          style={{ width: VectorVisualize.CANVAS_SIZE, height: VectorVisualize.CANVAS_SIZE }}
          onContextCreate={this.handleContextCreate}
        />
      </View>
    );
  }
}
export {VectorVisualize, OrientationVisualize, MagnitudeVisualize};