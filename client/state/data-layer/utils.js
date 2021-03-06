/**
 * Internal dependencies
 *
 * @format
 */

import { extendAction } from 'state/utils';

const doBypassDataLayer = {
	meta: {
		dataLayer: {
			doBypass: true,
		},
	},
};

export const bypassDataLayer = action => extendAction( action, doBypassDataLayer );
