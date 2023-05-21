import App from "./App.vue";
import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import * as THREE from "three";
import { Color } from "three";
import * as TWEEN from "@tweenjs/tween.js";

import { Scene2D } from "@/app/Scene2D";

import { Circle } from "@/app/objects/Circle";
import { Line } from "@/app/objects/Line";

import { useGraphStore } from "@/stores/vertex";
import { getVector3 } from "@/app/utils/transformer";

const app = createApp(App);

app.use(createPinia());

app.mount("#app");

// =============================

// Create a new instance of the scene
const scene = new Scene2D();

// Квадрат, который крутится по обеим осям с разными скоростями
// {
// 	// Create a square geometry and material
// 	const geometry = new THREE.PlaneGeometry(1, 1);
//
// 	const material = new THREE.MeshBasicMaterial({
// 		color: 0xF5DEB3, // wheat
// 		side: THREE.DoubleSide, // render both sides of the plane
// 	});
//
// // Create a mesh and add it to the scene
// 	const mesh = new THREE.Mesh(geometry, material);
// 	scene.addToScene(mesh);
//
// // Creating new animator
// 	const meshAnimator = new RotationAnimator(mesh, 0.01, 0.03);
// 	scene.addAnimator(meshAnimator);
// }


let lastDrawnCircle: [number, number] = [-0.4 * 5.25, 1];
let lastCircle: Circle;

const allCircles: Circle[] = [];

const storage = useGraphStore();

for (let i = 0; i < 6; i++) {
	const nCircle = new Circle(scene, 0.1, lastDrawnCircle[0] + 0.6, lastDrawnCircle[1], new Color(0x48494B));

	lastDrawnCircle = [nCircle.xPos, nCircle.yPos];
	lastCircle = nCircle;

	storage.addVertex(nCircle);
	allCircles.push(nCircle);
}

console.log(`Vertices:`, storage.vertices);

// Матрица смежности
{
	const adjacencyMatrix = [
		[0, 0, 0, 0, 0, 1],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0]
	];

	console.log("Матрица смежности:", adjacencyMatrix);

	// Create lines between connected vertices
	for (let i = 0; i < adjacencyMatrix.length; i++) {
		for (let j = 0; j < adjacencyMatrix[i].length; j++) {
			if (adjacencyMatrix[i][j] === 1) {
				const row = i + 1;
				const col = j + 1;

				console.log(`Vertex ${row} is connected to vertex ${col}`);

				// Отрисовка линии между связанными вершинами
				{
					// Get the two vertices from storage
					const vertex1 = storage.vertices[i];
					const vertex2 = storage.vertices[j];

					// Create a new line with a material and geometry
					const line = new Line(scene, getVector3(vertex1), getVector3(vertex2), 0xff00ff, 16);

					// Add the line to the scene
					scene.addToScene(line);

					scene.addAnimator({
						animated_obj: line,
						animate: () => {
							// Update the positions of the line vertices
							line.setPosition(getVector3(vertex1), getVector3(vertex2), 0);
						}
					});
				}
			}
		}
	}


}

// Camera animations
{
	const startPosition = scene.camera.position.clone(); // current camera position
	const endPosition = new THREE.Vector3(0, 1, 5); // new camera position
	const duration = 1000; // duration of the animation in milliseconds

	console.log(`Moving camera to ${JSON.stringify(endPosition, null, 2)}`);

	new TWEEN.Tween(startPosition)
		.to(endPosition, duration)
		.easing(TWEEN.Easing.Quintic.InOut)
		.onUpdate(() => {
			const currentPosition = new THREE.Vector3();
			const alpha = 0.1; // set the alpha value between 0 and 1
			currentPosition.lerpVectors(startPosition, endPosition, alpha);
			scene.setCameraPosition(currentPosition.x, currentPosition.y);
		})
		.start();

	// Zoom
	setTimeout(() => {
		const startWidth = scene.cameraSizes.right - scene.cameraSizes.left;
		const endWidth = startWidth / 2; // divide by 2 to zoom in, multiply by 2 to zoom out
		const durationZoom = 1000;

		console.log(`Resizing camera to ${endWidth}`);

		new TWEEN.Tween({ width: startWidth })
			.to({ width: endWidth }, durationZoom)
			.easing(TWEEN.Easing.Quintic.InOut)
			.onUpdate(({ width }) => {
				scene.camWidth = width;
				scene.updateProjectionMatrix();
			})
			.start();
	}, 1100);
}

// Передвигаем все круги в центр внизу
{
	setTimeout(() => {
		allCircles.map((el) => {
			el.setPositionSmoothly(0, 0, 500);
		});
	}, 2300);
}

// Smoothly changing radius
{
	setTimeout(() => {
		lastCircle.changeRadiusSmoothly(0.3, 1000);
	}, 3300);

	setTimeout(() => {
		lastCircle.setPositionSmoothly(0, 1, 1000);
	}, 4000);

	setTimeout(() => {
		lastCircle.setPositionSmoothly(1, 1, 1000);
	}, 4700);

	setTimeout(() => {
		lastCircle.setPositionSmoothly(-1, 1, 1000);
	}, 5400);
}

// Call animate on the scene to start rendering
scene.animate();

