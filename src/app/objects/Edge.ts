import type { Node } from "@/app/structures/Node";
import type { Line } from "@/app/objects/Line";

export class Edge {
	line: Line;
	node1: Node;
	node2: Node;

	constructor(line: Line, node1: Node, node2: Node) {
		this.line = line;
		this.node1 = node1;
		this.node2 = node2;
	}
}
