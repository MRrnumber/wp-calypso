/**
 * Internal dependencies
 *
 * @format
 */
import { PRIVACY_POLICY_RECEIVE, PRIVACY_POLICY_REQUEST } from 'state/action-types';

/**
 * Internal dependencies
 */

export const requestPrivacyPolicy = () => ( {
	type: PRIVACY_POLICY_REQUEST,
} );

export const privacyPolicyReceive = data => ( {
	type: PRIVACY_POLICY_RECEIVE,
	...data,
} );
