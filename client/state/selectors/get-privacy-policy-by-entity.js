/**
 * External dependencies
 *
 * @format
 */

import { get } from 'lodash';

/**
 * Internal dependencies
 */

/**
 * Return the privacy policy by the given entity
 *
 * @param  {Object} state - Global state tree
 * @param {String} entity - the entity to get the privacy policy
 * @return {Object} Automattic privacy policy object
 */
export default function getPrivacyPolicyByEntity( state, entity ) {
	return get( state, [ 'privacyPolicy', 'entities', entity ], {} );
}
