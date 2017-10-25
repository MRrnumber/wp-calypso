/**
 * Internal dependencies
 */
import React from 'react';
import { get } from 'lodash';
import { Parser as HtmlToReact, ProcessNodeDefinitions } from 'html-to-react';

const isValidNode = () => ( true );
const processNodeDefinitions = new ProcessNodeDefinitions( React );

const processingInstructions = [
	{
		shouldProcessNode: ( node ) => {
			return get( node, 'parent.attribs.class', false );
		},

		processNode: node => {
			node.parent.attribs.class = 'privacy-policy-dialog__' + node.parent.attribs.class;
			return node.data;
		}
	}, {
		shouldProcessNode: () => ( true ),
		processNode: processNodeDefinitions.processDefaultNode,
	}
];

const htmlToReactParser = new HtmlToReact();

export default ( content ) => ( htmlToReactParser.parseWithInstructions(
	content,
	isValidNode,
	processingInstructions
) );

