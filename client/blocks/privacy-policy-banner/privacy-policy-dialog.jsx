/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import parser from './parser';
import Button from 'components/button';

class PrivacyPolicyDialog extends Component {
	render() {
		const buttons = <Button
			primary
			onClick={ this.props.onClose }
		>
			{ this.props.translate( 'Close' ) }
		</Button>;

		return (
			<Dialog
				isVisible={ this.props.isVisible }
				buttons={ [ buttons ] }
				additionalClassNames="privacy-policy-banner__dialog"
			>
				<div className="privacy-policy-banner__dialog-header">
					<div className="privacy-policy-banner__dialog-header-text">
						<h1>{ this.props.title }</h1>
						<p><em>version: { this.props.version }</em></p>
					</div>
				</div>

				<div className="privacy-policy-banner__dialog-body">
					{ parser( this.props.content ) }
				</div>
			</Dialog>
		);
	}
}

export default localize( PrivacyPolicyDialog );

