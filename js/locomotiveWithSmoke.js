if (!Detector.webgl) Detector.addGetWebGLMessage();

var container;

var camera, scene, renderer, objects;

var planet, planet, smoke;   

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load('obj/parowoz.dae', function (collada) {
    locomotiv = collada.scene;
    locomotiv.traverse(function (child) {
        if (child instanceof THREE.SkinnedMesh) {
            var animation = new THREE.Animation(child, child.geometry.animation);
            animation.play();
        }
    });

    locomotiv.scale.x = locomotiv.scale.y = locomotiv.scale.z = 100.8; 
    locomotiv.position.y = 460; 
    locomotiv.position.z += 512; 

    locomotiv.updateMatrix();

    locomotiv.traverse(function (child) {  
        child.castShadow = true;
        child.receiveShadow = false;
    });

});

loader.load('obj/planeta.dae', function (collada) {
    planet = collada.scene;
    planet.traverse(function (child) {
        if (child instanceof THREE.SkinnedMesh) {
            var animation = new THREE.Animation(child, child.geometry.animation);
            animation.play();
        }
    });

    planet.scale.x = planet.scale.y = planet.scale.z = 765.8; 
    planet.rotation.z = Math.PI / 2;

    planet.updateMatrix();

    planet.traverse(function (child) {  
        child.castShadow = false;
        child.receiveShadow = false;
    });

    init();
    animate();
});

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 40000);
    camera.position.set(Math.pow(2, 13), 1024, 0);

    scene = new THREE.Scene();

    scene.add(locomotiv);
    scene.add(planet);

    var light1 = new THREE.DirectionalLight(0xffffff);
    light1.castShadow = true;
    light1.position.set(2000, 2000, 1000);  
    
    scene.add(light1);

    scene.add(new THREE.AmbientLight(0xcccccc));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight); 
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    scene.fog = new THREE.Fog(0xbbddee, -2 * 1024, 32 * 1024);  

	smoke = new ParticleEngine();
	smoke.setValues( particle.smoke );
	smoke.initialize();
}

function onWindowResize() {					
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {				
    requestAnimationFrame(animate);
    render();
}

var clock = new THREE.Clock();
var kat = 0;

particle = {
smoke :
	{
		positionStyle    : Type.CUBE,
		positionBase     : new THREE.Vector3( 0, Math.pow(2, 11) *1.28,750),
		positionSpread   : new THREE.Vector3( 20, 100, 20 ),

		velocityStyle    : Type.CUBE,
		velocityBase     : new THREE.Vector3( 0, 150, 0 ),
		velocitySpread   : new THREE.Vector3( 120, 50, 120 ), 
		accelerationBase : new THREE.Vector3( 0,100,0 ),
		
		particleTexture : THREE.ImageUtils.loadTexture( 'img/smokeparticle.png'),

		angleBase               : 0,
		angleSpread             : 720,
		angleVelocityBase       : 0,
		angleVelocitySpread     : 720,
		
		sizeTween    : new Tween( [0, 1], [32, 128] ),
		opacityTween : new Tween( [0.8, 2], [0.5, 0] ),
		colorTween   : new Tween( [0.4, 1], [ new THREE.Vector3(0,0,0.2), new THREE.Vector3(0, 0, 0.5) ] ),

		particlesPerSecond : 2000,
		particleDeathAge   : 3.0,		
		emitterDeathAge    : 90
	},
};

function render() {
    kat += 0.02;			

    camera.position.x = Math.cos(kat) * Math.pow(2, 13);   
    camera.position.y = 1024;								
    camera.position.z = Math.sin(kat) * Math.pow(2, 13);

    scene.rotation.x += 0.02;

    planet.rotation.x -= 0.02;

    camera.lookAt(scene.position);		

    locomotiv.position.y = Math.pow(2, 11);
    locomotiv.position.z = 0; 

    THREE.AnimationHandler.update(clock.getDelta()); 
    smoke.update( 0.01 * 0.5 );				

    renderer.render(scene, camera);
}