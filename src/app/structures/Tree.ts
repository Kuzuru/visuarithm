import * as THREE from "three";
import { Color } from "three";
import { Circle } from "@/app/objects/Circle";
import { Line } from "@/app/objects/Line";
import type { Scene2D } from "@/app/Scene2D";
import { getVector3 } from "@/app/utils/transformer";
import { Node } from "@/app/structures/Node";
import { Edge } from "@/app/objects/Edge";

export class Tree {
	root: Node | null;
	positions: Set<string>; // New data structure to store positions

	constructor(rootData: number) {
		this.root = new Node(rootData);
		this.positions = new Set<string>();
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

	private getFreePosition(x: number, y: number, diameter: number): [number, number] {
		let newX = x;

		// Check if position is free
		while (this.positions.has(`${newX.toFixed(2)}-${y.toFixed(2)}`)) {
			newX += diameter;
		}

		return [newX, y];
	}

	private _drawNode(node: Node, scene: Scene2D, x: number, y: number, xSpacing: number, ySpacing: number) {
		// Find a free position for this node
		const [freeX, freeY] = this.getFreePosition(x, y, 0.4);

		// Create a circle for this node
		node.circle = new Circle(scene, 0.1, freeX, freeY, new Color(0x000000));

		// Add this position to the set of occupied positions
		this.positions.add(`${freeX.toFixed(2)}-${freeY.toFixed(2)}`);

		// Add circle to the scene
		scene.addToScene(<THREE.Object3D><unknown>node.circle);

		// If the node has children, draw them too
		for (let i = 0; i < node.children.length; i++) {
			const child = node.children[i];

			// Calculate position for this child
			let childX = x - (node.children.length - 1) * xSpacing / 2 + i * xSpacing;
			let childY = y - ySpacing;

			// Check if this position is free and adjust if necessary
			[childX, childY] = this.getFreePosition(childX, childY, 0.4);

			// Draw line between this node and its child
			if (node.circle) {
				const line = new Line(scene, getVector3(node.circle), new THREE.Vector3(childX, childY, 0), 0x000000, 4);
				scene.addToScene(line);

				const edge = new Edge(line, node, child);
				node.connectedEdges.push(edge);
				child.connectedEdges.push(edge);
			}

			// Draw child
			this._drawNode(child, scene, childX, childY, xSpacing, ySpacing);
		}

	}
}
