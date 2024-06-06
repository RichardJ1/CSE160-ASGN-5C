import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
// audio used [Free for use under the Pixabay Content License]: 
// Flow by Loksii 
// https://pixabay.com/music/beats-flow-211881/
// Award Ceremony Nomination - Solemn Winner Triumphant Victory by SoundGalleryBy
// https://pixabay.com/music/main-title-award-ceremony-nomination-solemn-winner-triumphant-victory-123485/


// 3D models used: 
// Little Fox by Rachael Hosein [CC-BY] via Poly Pizza
// crowd by apelab [CC-BY] via Poly Pizza
// Black/Grey Dual Subwoofer by Evol-Love [CC-BY] via Poly Pizza
// Dettweiler Block Stage (No FX) by Ulric Dettweiler [CC-BY] via Poly Pizza
// Crown by Poly by Google [CC-BY] via Poly Pizza

// All the coding work is my own, 
// but ChatGPT helped me make the cube, sphere, and speakers move
// when I couldn't figure out how to do it myself.
// Those parts are 90% my work, 10% ChatGPT


function main() {
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	// const aspect = 2; // the canvas default
	const aspect = canvas.clientWidth / canvas.clientHeight;
	// const aspect = window.innerWidth / window.innerHeight;
	const near = 0.1;
	const far = 400;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	// camera.position.z = 5;
	camera.position.set(0, 10, 30);

	const controls = new OrbitControls(camera, canvas);
	controls.target.set(0, 5, 0);
	controls.update();


	
	var sound;
	var volume = {volume: 0.5};
	var audioLoader;
	var audioFiles = {1 : 'public/award.mp3', 2 : 'public/flow.mp3'};
	var soundLoaded = false;

	function loadAudioFile(file) {
			audioLoader.load(file, function(buffer) {
					sound.setBuffer(buffer);
					sound.setLoop(true);
					sound.setVolume(0.5);
					soundLoaded = true; // Set soundLoaded to true after the buffer is loaded
					sound.play(); // Start playing the sound immediately after loading
			});
	}

	function addAudioListenerToCamera(camera) {
			const listener = new THREE.AudioListener();
			camera.add(listener);
			sound = new THREE.Audio(listener);
			audioLoader = new THREE.AudioLoader();
			loadAudioFile(audioFiles[1]); // Load the default audio file
	}

	document.addEventListener("keydown", (event) => {
		if (event.code === "Space") {
			if (!soundLoaded) {
					addAudioListenerToCamera(camera);
			} else {
					if (sound.isPlaying) {
							sound.pause();
					} else {
							sound.play();
					}
			}
		} else if (event.code === "Digit1") {
			if (soundLoaded) {
				sound.stop();
			} else {
				addAudioListenerToCamera(camera);
			}
			loadAudioFile(audioFiles[1]);
		}
		else if (event.code === "Digit2") {
			if (soundLoaded) {
				sound.stop();
			} else {
				addAudioListenerToCamera(camera);
			}
			loadAudioFile(audioFiles[2]);
		}
	
	
	});










	const scene = new THREE.Scene();
	


	const planeSize = 100;
     
	const loader = new THREE.TextureLoader();
	const texture = loader.load('public/checker.png');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.magFilter = THREE.NearestFilter;
	texture.colorSpace = THREE.SRGBColorSpace;
	const repeats = planeSize / 2;
	texture.repeat.set(repeats, repeats);


	const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
	const planeMat = new THREE.MeshPhongMaterial({
		map: texture,
		side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(planeGeo, planeMat);
	mesh.rotation.x = Math.PI * -.5;
	scene.add(mesh);

	// // gold
	// var cubeColor = '#DA0';
	// // silver
	// var sphereColor = '#CCC';

	// {
	// 	const cubeSize = 4;
	// 	const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
	// 	const cubeMat = new THREE.MeshPhongMaterial({color: cubeColor});
	// 	const mesh = new THREE.Mesh(cubeGeo, cubeMat);
	// 	mesh.position.set(cubeSize + 1, cubeSize / 2 + 8, 0);
	// 	scene.add(mesh);
	// }
	// {
	// 	const sphereRadius = 3;
	// 	const sphereWidthDivisions = 32;
	// 	const sphereHeightDivisions = 16;
	// 	const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
	// 	const sphereMat = new THREE.MeshPhongMaterial({color: sphereColor});
	// 	const mesh = new THREE.Mesh(sphereGeo, sphereMat);
	// 	mesh.position.set(-sphereRadius - 1, sphereRadius + 7.5, 0);
	// 	scene.add(mesh);
	// }

	var cubeColor = new THREE.Color('#DA0'); // gold
	var sphereColor = new THREE.Color('#CCC'); // silver

	const cubeSize = 4;
	const sphereRadius = 3;
	const sphereWidthDivisions = 32;
	const sphereHeightDivisions = 16;

	const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
	const cubeMat = new THREE.MeshPhongMaterial({color: cubeColor});
	const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
	cubeMesh.position.set(cubeSize + 1, cubeSize / 2 + 8, 0);
	scene.add(cubeMesh);

	const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
	const sphereMat = new THREE.MeshPhongMaterial({color: sphereColor});
	const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
	sphereMesh.position.set(-sphereRadius - 1, sphereRadius + 7.5, 0);
	scene.add(sphereMesh);

	const colorCycleSpeed = 0.005;
	let hue = 0;

	const animateColors = () => {
			hue += colorCycleSpeed;
			if (hue > 1) hue = 0;

			const cubeNewColor = new THREE.Color("hsl(" + (hue * 360) + ", 100%, 50%)");
			cubeMat.color.set(cubeNewColor);

			const sphereNewColor = new THREE.Color("hsl(" + ((hue + 0.5) % 1 * 360) + ", 100%, 50%)");
			sphereMat.color.set(sphereNewColor);

			requestAnimationFrame(animateColors);
	};

	// Start the animation
	animateColors();



	class ColorGUIHelper {

		constructor( object, prop ) {

			this.object = object;
			this.prop = prop;

		}
		get value() {

			return `#${this.object[ this.prop ].getHexString()}`;

		}
		set value( hexString ) {

			this.object[ this.prop ].set( hexString );

		}

	}

	class DegRadHelper {
		constructor(obj, prop) {
			this.obj = obj;
			this.prop = prop;
		}
		get value() {
			return THREE.MathUtils.radToDeg(this.obj[this.prop]);
		}
		set value(v) {
			this.obj[this.prop] = THREE.MathUtils.degToRad(v);
		}
	}


	function makeXYZGUI( gui, vector3, name, onChangeFn ) {

		const folder = gui.addFolder( name );
		folder.add( vector3, 'x', - 10, 10 ).onChange( onChangeFn );
		folder.add( vector3, 'y', 0, 10 ).onChange( onChangeFn );
		folder.add( vector3, 'z', - 10, 10 ).onChange( onChangeFn );
		folder.open();

	}

	{

		const color = 0xFFFFFF;
		const intensity = 150;
		const light = new THREE.SpotLight( color, intensity );
		light.position.set( 0, 7, 0 );
		light.target.position.set( 0, 0, 0 );
		scene.add( light );
		scene.add( light.target );

		const helper = new THREE.SpotLightHelper( light );
		// scene.add( helper );

		function updateLight() {

			light.target.updateMatrixWorld();
			helper.update();

		}

		const color2 = 0xFFFFFF;
		const intensity2 = 1;
		const light2 = new THREE.AmbientLight( color2, intensity2 );
		scene.add( light2 );

		const color3 = 0xFFFFFF;
		const intensity3 = 3;
		const light3 = new THREE.DirectionalLight( color3, intensity3 );
		light3.position.set( - 1, 4, 4 );
		light3.target.position.set( 0, 0, 0 );
		scene.add( light3 );
		scene.add( light3.target );


		updateLight();

		// // updating volume
		// function updateVolume(volume) {
		// 	sound.setVolume(volume);
		// }

		// updateVolume(0.5);

		const gui = new GUI();

		// gui.add(volume, 'volume', 0, 1, 0.01).name("Volume").onChange(updateVolume);

		function updateVolume(volume) {
			sound.setVolume(volume);
		}

		function pauseResumeSound() {
			if (!soundLoaded) {
				addAudioListenerToCamera(camera);
			} else {
				if (sound.isPlaying) {
						sound.pause();
				} else {
						sound.play();
				}
		}
		}

		function changeSong(songIndex) {
			console.log(songIndex);
			const realSongIndex = songOptions[songIndex];
			if (soundLoaded) {
					sound.stop();
			} else {
					addAudioListenerToCamera(camera);
			}
			loadAudioFile(audioFiles[realSongIndex]);
	}
	const songOptions = {
    'Award': 1,
    'Flow': 2
	};


		const soundFolder = gui.addFolder('Sound');
		soundFolder.add( volume, 'volume', 0, 1, 0.01 ).name( 'Volume' ).onChange( updateVolume );
		soundFolder.add({pauseResumeSound}, 'pauseResumeSound').name('Pause/Resume Sound');
		soundFolder.add({ song: 'Award' }, 'song', Object.keys(songOptions)).name('Select Song').onChange((value) => {
			changeSong(value);
	});

		const lightFolder = gui.addFolder('Lights');
		lightFolder.addColor( new ColorGUIHelper( light2, 'color' ), 'value' ).name( 'ambient color' );
		lightFolder.add( light2, 'intensity', 0, 5, 0.01 ).name( 'ambient intensity' );

		lightFolder.addColor( new ColorGUIHelper( light3, 'color' ), 'value' ).name( 'directional color' );
		lightFolder.add( light3, 'intensity', 0, 5, 0.01 ).name( 'directional intensity' );


		lightFolder.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'spotlight color' );
		lightFolder.add( light, 'intensity', 0, 250, 1 ).name( 'spotlight intensity' );
		lightFolder.add( light, 'distance', 0, 40 ).name("spotlight distance").onChange( updateLight );
		lightFolder.add( new DegRadHelper( light, 'angle' ), 'value', 0, 90 ).name( 'spotlight angle' ).onChange( updateLight );
		lightFolder.add( light, 'penumbra', 0, 1, 0.01 ).name( 'spotlight penumbra' );

		makeXYZGUI( gui, light.position, 'spotlight position', updateLight );
		makeXYZGUI( gui, light.target.position, 'spotlight target', updateLight );

		makeXYZGUI( gui, light3.position, 'directional position', updateLight );
		makeXYZGUI( gui, light3.target.position, 'directional target', updateLight );

		// music
		// gui

		// volume
		// gui.add(volume, 'volume', 0, 1, 0.01).name("Volume");



	}


	{
		const loader = new THREE.CubeTextureLoader();
		const texture = loader.load([
			'public/Background.png',
			'public/Background.png',
			'public/Background.png',
			'public/Background.png',
			'public/Background.png',
			'public/Background.png'
		]);
		scene.background = texture;
	}








	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	function makeInstance( geometry, color, x, y, z, textured = false) {

		// const material = new THREE.MeshPhongMaterial( { color } );
    let material;

    if (textured) {
      function loadColorTexture( path ) {
        const texture = loader.load( path );
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      }

      const loader = new THREE.TextureLoader();
      material = [
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama1.webp')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama2.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama3.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama4.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama5.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama6.png')})
      ];
    }
    else {
      material = new THREE.MeshPhongMaterial( { color } );
    }

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;
		cube.position.y = y;
		cube.position.z = z;

		return cube;

	}

	const cubes = [
		makeInstance( geometry, 0x44aa88, 0, 4.5, 0, true ),
		makeInstance( geometry, 0x8844aa, - 2, 4, 0 ),
		makeInstance( geometry, 0xaa8844, 2, 3.5, 0),
	];

	// draw cubes from -15 to 15 in both x and z dimensions
	for (let x = -20; x <= 20; x ++) {
		for (let z = -20; z <= 20; z++) {
			const y = 40 - (Math.abs(x) + Math.abs(z));

			// make a random color using hexadecimal
			const cube_color = Math.random() * 0xffffff;

			makeInstance(geometry, cube_color, x, y, z);
		}
	}

	// pedastal
	// third place (brown)
	const brown = 0x8B4513;
	makeInstance( geometry, brown, 2, 2, 0)
	// second place (silver)
	const silver = 0xC0C0C0;
	makeInstance( geometry, silver, -2, 2, 0)
	makeInstance( geometry, silver, -2, 2.5, 0)
	// first place (gold)
	const gold = 0xFFD700;
	makeInstance( geometry, gold, 0, 2, 0)
	makeInstance( geometry, gold, 0, 3, 0)
	// makeInstance( geometry, gold, 0, 4, 0)




  {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
     mtlLoader.load('public/materials.mtl', (mtl) => {
       mtl.preload();
       objLoader.setMaterials(mtl);
     });

    objLoader.load('public/model.obj', (root) => {
      root.position.set(0, 1.85, 4); // Move the model 5 units to the right
			root.rotation.y = -Math.PI/2;
      scene.add(root);
    });
    // });
  }

	// repeat with crowd instead of model/materials
	{
		const crowdLoader = new MTLLoader();
		const crowdObjLoader = new OBJLoader();
		 crowdLoader.load('public/crowd.mtl', (mtl) => {
			 mtl.preload();
			 crowdObjLoader.setMaterials(mtl);
		 });

		 crowdObjLoader.load('public/crowd.obj', (root) => {
			root.position.set(-5.3, 3.9, 5); // Move the model 5 units to the left
			scene.add(root);
		});
		// crowdObjLoader.load('public/crowd.obj', (root) => {
		// 	root.position.set(-7, 3.9, 4); // Move the model 5 units to the left
		// 	scene.add(root);
		// });
		crowdObjLoader.load('public/crowd.obj', (root) => {
			root.position.set(-9, 3, 7); // Move the model 5 units to the left
			scene.add(root);
		});

		crowdObjLoader.load('public/crowd.obj', (root) => {
			root.position.set(5.3, 3.9, 5); // Move the model 5 units to the left
			// reflect object across x-axis
			root.scale.x *= -1;
			
			scene.add(root);
		});
		// crowdObjLoader.load('public/crowd.obj', (root) => {
		// 	root.position.set(-7, 3.9, 4); // Move the model 5 units to the left
		// 	scene.add(root);
		// });
		crowdObjLoader.load('public/crowd.obj', (root) => {
			root.position.set(9, 3, 7); // Move the model 5 units to the left
			root.scale.x *= -1;
			scene.add(root);
		});



		// });
	}

	// repeat with speaker instead of model/materials
	{
		// let sizeScalar = 5;

		// const speakerLoader = new MTLLoader();
		// const speakerObjLoader = new OBJLoader();
		//  speakerLoader.load('public/speaker.mtl', (mtl) => {
		// 	 mtl.preload();
		// 	 speakerObjLoader.setMaterials(mtl);
		//  });

		//  speakerObjLoader.load('public/speaker.obj', (root) => {
		// 	root.position.set(-20, 2, 0); // Move the model 5 units to the left
		// 	// root.rotation.y = -Math.PI;
		// 	root.scale.set(sizeScalar, sizeScalar, sizeScalar);
		// 	scene.add(root);
		// });
		// speakerObjLoader.load('public/speaker.obj', (root) => {
		// 	root.position.set(0, 2, -20); // Move the model 5 units to the left
		// 	root.rotation.y = -Math.PI/2;
		// 	root.scale.set(sizeScalar, sizeScalar, sizeScalar);
		// 	scene.add(root);
		// });
		// speakerObjLoader.load('public/speaker.obj', (root) => {
		// 	root.position.set(20, 2, 0); // Move the model 5 units to the left
		// 	root.rotation.y = Math.PI;
		// 	root.scale.set(sizeScalar, sizeScalar, sizeScalar);
		// 	scene.add(root);
		// });
		// speakerObjLoader.load('public/speaker.obj', (root) => {
		// 	root.position.set(0, 2, 20); // Move the model 5 units to the left
		// 	root.rotation.y = Math.PI/2;
		// 	root.scale.set(sizeScalar, sizeScalar, sizeScalar);
		// 	scene.add(root);
		// });

		let sizeScalar = 5;
		let scaleDirection = 1;
		let minScale = 4.5;
		let maxScale = 5.5;

		const speakerLoader = new MTLLoader();
		const speakerObjLoader = new OBJLoader();
		speakerLoader.load('public/speaker.mtl', (mtl) => {
				mtl.preload();
				speakerObjLoader.setMaterials(mtl);
		});

		let speakers = [];

		const loadSpeaker = (position, rotation) => {
				speakerObjLoader.load('public/speaker.obj', (root) => {
						root.position.set(position.x, position.y, position.z);
						root.rotation.y = rotation;
						root.scale.set(sizeScalar, sizeScalar, sizeScalar);
						scene.add(root);
						speakers.push(root);
				});
		};

		loadSpeaker({ x: -20, y: 2, z: 0 }, 0);
		loadSpeaker({ x: 0, y: 2, z: -20 }, -Math.PI / 2);
		loadSpeaker({ x: 20, y: 2, z: 0 }, Math.PI);
		loadSpeaker({ x: 0, y: 2, z: 20 }, Math.PI / 2);

		const animateSpeakers = () => {
				sizeScalar += 0.05 * scaleDirection;
				if (sizeScalar > maxScale || sizeScalar < minScale) {
						scaleDirection *= -1; // Reverse the scaling direction
				}

				speakers.forEach((speaker) => {
						speaker.scale.set(sizeScalar, sizeScalar, sizeScalar);
				});

				requestAnimationFrame(animateSpeakers);
		};

		// Start the animation
		animateSpeakers();

			

		// adding the stage
		const stageLoader = new MTLLoader();
		const stageObjLoader = new OBJLoader();
		 stageLoader.load('public/stage.mtl', (mtl) => {
			 mtl.preload();
			 stageObjLoader.setMaterials(mtl);
		 });

		 stageObjLoader.load('public/stage.obj', (root) => {
			// scale it by 10
			root.scale.set(10, 11, 10);
			root.position.set(0, 5.5, 1); // Move the model 5 units to the left
			root.rotation.y = Math.PI;
			scene.add(root);
		});

		// adding the crown to the fox's head
		const crownLoader = new MTLLoader();
		const crownObjLoader = new OBJLoader();
		 crownLoader.load('public/crown.mtl', (mtl) => {
			 mtl.preload();
			 crownObjLoader.setMaterials(mtl);
		 });

		 crownObjLoader.load('public/crown.obj', (root) => {
			root.position.set(0.1, 2.35, 4); // Move the model 5 units to the left
			root.scale.set(0.2, 0.2, 0.2);
			scene.add(root);
		});

		

	}

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = window.innerWidth;
		const height = window.innerHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
				renderer.setSize(width, height, false);
		}
		return needResize;
}

	function render( time ) {

		time *= 0.001; // convert time to seconds

		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
	}

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );



}

main();