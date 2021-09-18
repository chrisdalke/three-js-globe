import './assets/css/main.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as dat from 'dat.gui';

class Background extends THREE.Mesh {
    constructor() {
        const vertexShader = `
varying vec2 vUv;
varying vec4 vScreenSpacePos;

void main() {
    vUv = uv;
    gl_Position = vec4( position, 1.0 );
    vScreenSpacePos = gl_Position;
}
`;

/**
 * Get the distance between (0,0) and the pixel.
 * Use distance to interpolate between two colors
 */
        const fragmentShader = `
varying vec4 vScreenSpacePos;

void main() {
    vec4 colorLight = vec4(0.925490196,1,1,1.0);
    vec4 colorDark = vec4(0.258823529,0.380392157,0.560784314,1.0);
    float dist = distance(vScreenSpacePos.xy, vec2(0.0));
    dist *= dist;
    gl_FragColor = mix(colorLight, colorDark, dist);
}
`;

        const geometry = new THREE.PlaneBufferGeometry(2,2);
        const material = new THREE.ShaderMaterial({
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          depthWrite: false,
          depthTest: false
        });
        super(geometry, material);
    }

    update() {

    }

    render() {

    }
}

class SphereObject extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.SphereGeometry( 1, 20, 20 );
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: new THREE.Color(0xABB7C7),
            shininess: 5.0,
            wireframe: true
          });

        super(geometry, material);
    }

    update() {

    }

    render() {

    }
}

class MapApp {
    constructor() {
        this.gui = new dat.GUI();
        this.container = document.querySelector('#container');
        this.canvas = document.querySelector('canvas.webgl');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x496C99 );


        this.stats = new Stats();
        this.container.appendChild(this.stats.dom);

        const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        light.color.setHSL( 0.6, 1, 0.6 );
        light.groundColor.setHSL( 0.095, 1, 0.75 );
        light.position.set( 0, 50, 0 );
        this.scene.add(light);
        const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( - 1, 1.75, 1 );
        dirLight.position.multiplyScalar( 30 );
        this.scene.add(dirLight);

        const background = new Background();
        //this.scene.add(background);

        const sphere = new SphereObject();
        this.scene.add(sphere);

        const pointLight = new THREE.PointLight(0xffffff, 0.1)
        pointLight.position.x = 2
        pointLight.position.y = 3
        pointLight.position.z = 4
        this.scene.add(pointLight);

        

        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        window.addEventListener('resize', () => this.onResize());
        
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 2;
        this.scene.add(this.camera);

        this.controls = new OrbitControls( this.camera, this.canvas );
        this.controls.enablePan = false;


        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.clock = new THREE.Clock();
        this.render();
    }

    onResize() {
        // Update sizes
        this.sizes.width = window.innerWidth;
        this.sizes.height = window.innerHeight;

        // Update camera
        this.camera.aspect = this.sizes.width / this.sizes.height;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    // Called at a fixed 60hz.
    update() {
        this.objects.forEach((object) => object.update());
    }

    // Called on every frame
    render() {
        const elapsedTime = this.clock.getElapsedTime();

        this.controls.update();
        this.stats.update();

        // Render
        this.renderer.render(this.scene, this.camera)
    
        // Call tick again on the next frame
        window.requestAnimationFrame(() => this.render());
    }
}

export default new MapApp();