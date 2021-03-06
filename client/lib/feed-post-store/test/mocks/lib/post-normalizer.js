/**
 * External dependencies
 *
 * @format
 */

import { clone, noop } from 'lodash';

function fakeNormalize( post, transforms, callback ) {
	callback( null, clone( post ) );
}

function noopFactory() {
	return noop;
}

[ 'safeImageProperties', 'withContentDOM', 'keepValidImages' ].forEach( function( prop ) {
	fakeNormalize[ prop ] = noopFactory;
} );

fakeNormalize.content = {};

[ 'makeImagesSafe' ].forEach( function( prop ) {
	fakeNormalize.content[ prop ] = noopFactory;
} );

export default fakeNormalize;
