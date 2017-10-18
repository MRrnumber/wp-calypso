/**
 * Internal dependencies
 *
 * @format
 */

/**
 * Internal dependencies
 */
import { combineReducers, createReducer } from 'state/utils';
import { PRIVACY_POLICY_RECEIVE } from 'state/action-types';

import { privacyPolicySchema } from './schema';

export const entities = createReducer(
	{},
	{
		[ PRIVACY_POLICY_RECEIVE ]: ( state, actions ) => actions.entities,
	},
	privacyPolicySchema
);

export default combineReducers( {
	entities,
} );
