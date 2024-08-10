import { GLTFLoader } from "../../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js";
import { Raycaster, Vector2 } from "../../libs/three.js-r132/build/three.module.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: '../../assets/targets/pc.mind',
        });
        const { renderer, scene, camera } = mindarThree;

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const anchor = mindarThree.addAnchor(0);

        const loader = new GLTFLoader();
        const raycaster = new Raycaster();
        const mouse = new Vector2();
        const mixers = []; // Array to store mixers for each model

        // Load and handle the first GLTF model with animation
        loader.load("../../assets/models/b.glb", (gltf) => {
            gltf.scene.scale.set(0.8, 0.8, 0.8);
            gltf.scene.position.set(0.3, -0.3, -0.0);
            anchor.group.add(gltf.scene);

            // Animation setup
            const mixer = new THREE.AnimationMixer(gltf.scene);
            gltf.animations.forEach((clip) => {
                const action = mixer.clipAction(clip);
                action.setEffectiveTimeScale(0.0015); // Set time scale to 0.5 (half speed)
                action.play();
            });
            mixers.push(mixer);

            // Add click event to open the link
            document.addEventListener('click', (event) => {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(gltf.scene.children, true);

                if (intersects.length > 0) {
                    console.log('Model clicked: Opening https://www.youtube.com/watch?v=XV1cOGaZUq0');
                    window.open("https://www.youtube.com/watch?v=XV1cOGaZUq0", '_blank');
                }
            });
        });

        await mindarThree.start();

        renderer.setAnimationLoop((delta) => {
            renderer.render(scene, camera);
            mixers.forEach((mixer) => mixer.update(delta / 1000));
        });
    }

    start();
});
