import * as THREE from 'three';
import { Color } from "three";
import { Circle } from "@/app/objects/Circle";
import { Line } from "@/app/objects/Line";
import type { Scene2D } from "@/app/Scene2D";
import { getVector3 } from "@/app/utils/transformer";

export class Node {
	data: number;
	children: Node[];
	circle: Circle | null;

	constructor(data: number) {
		this.data = data;
		this.children = [];
		this.circle = null;
	}

	addChild(node: Node) {
		this.children.push(node);
	}
}

export class Tree {
	root: Node | null;

	constructor(rootData: any) {
		this.root = new Node(rootData);
	}

	findNode(node: Node | null, data: any): Node | null {
		if (!node) {
			return null;
		}

		if (node.data === data) {
			return node;
		}

		for (const child of node.children) {
			const result = this.findNode(child, data);

			if (result) {
				return result;
			}
		}

		return null;
	}

	draw(scene: Scene2D, xSpacing: number, ySpacing: number) {
		if (this.root) {
			this._drawNode(this.root, scene, 0, 0, xSpacing, ySpacing);
		}
	}

	private _drawNode(node: Node, scene: Scene2D, x: number, y: number, xSpacing: number, ySpacing: number) {
		// Create a circle for this node
		node.circle = new Circle(scene, 0.1, x, y, new Color(0x000000));

		// Add circle to the scene
		scene.addToScene(<THREE.Object3D><unknown>node.circle);

		// If the node has children, draw them too
		for (let i = 0; i < node.children.length; i++) {
			const child = node.children[i];

			// Calculate position for this child
			const childX = x - (node.children.length - 1) * xSpacing / 2 + i * xSpacing;
			const childY = y - ySpacing;

			// Draw line between this node and its child
			if (node.circle) {
				const line = new Line(scene, getVector3(node.circle), new THREE.Vector3(childX, childY, 0), Math.random() * 0xffffff, 4);
				scene.addToScene(line);
			}

			// Draw child
			this._drawNode(child, scene, childX, childY, xSpacing, ySpacing);
		}
	}
}
