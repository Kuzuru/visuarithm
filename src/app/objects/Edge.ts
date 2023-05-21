import type { Node } from "@/app/structures/Node";
import type { Line } from "@/app/objects/Line";

export class Edge {
	constructor(public node1: Node, public node2: Node, public line: Line) {
	}
}
