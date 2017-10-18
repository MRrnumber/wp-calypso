/** @format */

export const privacyPolicySchema = {
	type: 'object',
	additionalProperties: false,
	patternProperties: {
		'^[a-z/_-]+$': {
			type: 'object',
		},
	},
};
