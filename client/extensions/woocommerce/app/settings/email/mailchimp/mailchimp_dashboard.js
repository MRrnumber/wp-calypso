/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import { localize } from 'i18n-calypso';
import Card from 'components/card';
import FormCheckbox from 'components/forms/form-checkbox';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormLegend from 'components/forms/form-legend';
import CompactFormToggle from 'components/forms/form-toggle/compact';
import FormTextInput from 'components/forms/form-text-input';
import Notice from 'components/notice';
import QueryMailChimpSyncStatus from 'woocommerce/state/sites/settings/email/querySyncStatus';
import {
	syncStatus,
	mailChimpSettings,
	isRequestingSettings,
	isRequestingSyncStatus,
	isSavingSettings,
	} from 'woocommerce/state/sites/settings/email/selectors';
import { submitMailChimpNewsletterSettings, requestResync } from 'woocommerce/state/sites/settings/email/actions.js';
import { isSubmittingNewsletterSetting, newsletterSettingsSubmitError } from 'woocommerce/state/sites/settings/email/selectors';
import { errorNotice, successNotice } from 'state/notices/actions';

const SyncTab = localize( ( { siteId, translate, syncState, resync, isRequesting } ) => {
	const { account_name, store_syncing, product_count, mailchimp_total_products,
		mailchimp_total_orders, order_count } = syncState;
	const hasProductInfo = ( undefined !== product_count ) && ( undefined !== mailchimp_total_products );
	const products = hasProductInfo ? ( product_count + '/' + mailchimp_total_products ) : '';
	const hasOrdersInfo = ( undefined !== order_count ) && ( undefined !== mailchimp_total_orders );
	const orders = hasOrdersInfo ? ( order_count + '/' + mailchimp_total_orders ) : '';

	const synced = () => (
		<Notice
			status="is-success"
			isCompact
			showDismiss={ false }
			text={ translate(
				'{{div}}{{div_name}}%(mailingListname)s{{/div_name}} {{div_info}}list synced.{{/div_info}}{{/div}}',
				{
					components: {
						div: <div className="mailchimp__sync-notice-content" />,
						div_name: <span className="mailchimp__sync-notice-list" />,
						div_info: <span className="mailchimp__sync-notice-info" />,
					},
					args: { mailingListname: syncState.mailchimp_list_name }
				} ) }
		/>
	);

	const syncing = () => (
		<Notice
			status="is-warning"
			isCompact
			showDismiss={ false }
			text={ translate(
				'{{div}}{{div_name}}%(mailingListname)s{{/div_name}} {{div_info}}list is being synced.{{/div_info}}{{/div}}',
				{
					components: {
						div: <div className="mailchimp__sync-notice-content" />,
						div_name: <span className="mailchimp__sync-notice-list" />,
						div_info: <span className="mailchimp__sync-notice-info" />,
					},
					args: { mailingListname: syncState.mailchimp_list_name }
				} ) }
		/>
	);

	const loadingSyncStatus = () => (
		<Notice
			isCompact
			showDismiss={ false }
			text={ translate( 'Loading sync status.' ) }
		/>
	);

	const onResyncClick = () => {
		! store_syncing && resync( siteId );
	};

	const notice = ( () => {
		if ( isRequesting && isEmpty( syncState ) ) {
			return loadingSyncStatus();
		}
		return store_syncing ? syncing() : synced();
	} )();

	return (
		<div>
			<div className="mailchimp__account-info-name">
				{ translate( '{{span_info}}MailChimp account:{{/span_info}} {{span}}%(account_name)s{{/span}}', {
					components: {
						span_info: <span className="mailchimp__account-info" />,
						span: <span />,
					},
					args: {
						account_name
					}
				} ) }
			</div>
			<span className="mailchimp__sync-status">{ notice }</span>
			<a className="mailchimp__resync-link" onClick={ onResyncClick }>
				{ translate( 'Resync', { comment: 'to synchronize again' } ) }
			</a>
			<div>
				{ translate( '{{span_info}}Products:{{/span_info}} {{span}}%(products)s{{/span}}', {
					components: {
						span_info: <span className="mailchimp__account-info" />,
						span: <span />,
					},
					args: {
						products
					}
				} ) }
				{ translate( '{{span_info}}Orders:{{/span_info}} {{span}}%(orders)s{{/span}}', {
					components: {
						span_info: <span className="mailchimp__account-info-orders" />,
						span: <span />,
					},
					args: {
						orders
					}
				} ) }
			</div>
		</div>
	);
} );

SyncTab.propTypes = {
	siteId: PropTypes.number.isRequired,
	syncState: PropTypes.object,
	isRequestingSettings: PropTypes.bool,
	resync: PropTypes.func.isRequired,
};

const Settings = localize( ( { translate, settings, oldCheckbox, onChange } ) => {
	const onCheckedStateChange = () => {
		const currentValue = settings.mailchimp_checkbox_defaults;
		const nextValue = currentValue === 'check' ? 'uncheck' : 'check';
		onChange( { mailchimp_checkbox_defaults: nextValue } );
	};

	const onNewsletterLabelChange = ( e ) => {
		onChange( { newsletter_label: e.target.value } );
	};

	const onToggleSubscribeMessage = ( e ) => {
		// check if we had previously selected something in checked/unchecked area
		// this way we can use old value on toggling visibility,
		// this is just to improve UX
		const visibleOption = 'hide' !== oldCheckbox ? oldCheckbox : 'check';
		onChange( { mailchimp_checkbox_defaults: e ? visibleOption : 'hide' } );
	};

	const subscriptionPromptState = settings.mailchimp_checkbox_defaults;
	const toggle = subscriptionPromptState === 'check' || subscriptionPromptState === 'uncheck';
	return (
		<div className="mailchimp__dashboard-settings">
			<span className="mailchimp__dashboard-settings-form">
				<FormFieldset>
					<FormLegend>{ translate( 'Newsletter subscriptions' ) }</FormLegend>
					<FormLabel className="mailchimp__dashboard-settings-form-field">
						<CompactFormToggle
							checked={ toggle }
							onChange={ onToggleSubscribeMessage }
							id="show-subscribe-message"
						/>
						<span>{ translate( 'Show a subscribe message to customer at checkout' ) }</span>
					</FormLabel>
					<FormLabel className="mailchimp__dashboard-settings-form-field">
						<FormCheckbox
							className="mailchimp__dashboard-settings-form-checkbox"
							checked={ 'check' === subscriptionPromptState }
							disabled={ ! toggle }
							onChange={ onCheckedStateChange }
						/>
						<span>{ translate( 'Subscribe message is checked by default' ) }</span>
					</FormLabel>
					<FormLabel className="mailchimp__dashboard-settings-form-field">
						<span>{ translate( 'Subscribe message' ) }</span>
						<FormTextInput
							name="newsletter_label"
							onChange={ onNewsletterLabelChange }
							value={ settings.newsletter_label }
						/>
					</FormLabel>
				</FormFieldset>
			</span>
			<span className="mailchimp__dashboard-settings-preview">
				<div className="mailchimp__dashboard-settings-preview-heading">{ translate( 'PREVIEW' ) }</div>
				<div className="mailchimp__dashboard-settings-preview-view">
					{ toggle && <FormLabel>
							<FormCheckbox checked={ 'check' === subscriptionPromptState } disabled />
							<span>{ settings.newsletter_label }</span>
						</FormLabel>}
				</div>
			</span>
		</div>
	);
} );

Settings.propTypes = {
	settings: PropTypes.object,
	oldCheckbox: PropTypes.string,
	isSaving: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
};

class MailChimpDashboard extends React.Component {

	constructor( props ) {
		super( props );
		this.state = {
			syncStatus: null,
			settings: props.settings,
		};
	}

	componentWillReceiveProps( nextProps ) {
		const { translate } = nextProps;
		if ( ( false === nextProps.isSaving ) && this.props.isSaving ) {
			if ( nextProps.newsletterSettingsSubmitError ) {
				nextProps.errorNotice( translate( 'There was a problem saving the email settings. Please try again.' ) );
			} else {
				nextProps.successNotice( translate( 'Email settings saved.' ), { duration: 4000 } );
			}
		}
		if ( ( false === this.props.saveSettingsRequest ) && nextProps.saveSettingsRequest ) {
			this.onSave();
		}
	}

	onSettingsChange = ( change ) => {
		this.setState( { settings: Object.assign( {}, this.state.settings, change ) } );
	}

	onSave = () => {
		const { submitMailChimpNewsletterSettings: submit, siteId } = this.props;
		const settings = this.state.settings;
		const message = {
			mailchimp_list: settings.mailchimp_list,
			newsletter_label: settings.newsletter_label,
			mailchimp_auto_subscribe: settings.mailchimp_auto_subscribe,
			mailchimp_checkbox_defaults: settings.mailchimp_checkbox_defaults,
			mailchimp_checkbox_action: settings.mailchimp_checkbox_action,
		};
		submit( siteId, message );
	}

	render() {
		const { siteId, syncStatusData, translate, onNoticeExit, wizardCompleted } = this.props;
		return (
			<div>
				<QueryMailChimpSyncStatus siteId={ siteId } />
				{ wizardCompleted && <Notice className="mailchimp__dashboard-success-notice"
					status="is-success"
					showDismiss
					onDismissClick={ onNoticeExit }
					text={ translate( 'Nice! The last thing to do is to make sure the newsletter subscriptions are looking good.' ) }
				/> }
				<Card className="mailchimp__dashboard" >
					<div className="mailchimp__dashboard-first-section" >
						<span className="mailchimp__dashboard-title-and-slogan">
							<div className="mailchimp__dashboard-title">MailChimp</div>
							<div className="mailchimp__header-description">
								{ translate( 'Allow customers to subscribe to your MailChimp email list' ) }
							</div>
						</span>
						<span className="mailchimp__dashboard-sync-status" >
							<SyncTab
								siteId={ siteId }
								isRequesting={ this.props.isRequestingSyncStatus }
								syncState={ syncStatusData }
								resync={ this.props.requestResync } />
						</span>
					</div>
					<div className="mailchimp__dashboard-second-section" >
						<Settings
							settings={ this.state.settings }
							isRequesting={ this.props.isRequestingSettings }
							onChange={ this.onSettingsChange }
							onSave={ this.onSave }
							isSaving={ this.props.isSaving }
							oldCheckbox={ this.props.settings.mailchimp_checkbox_defaults } />
					</div>
				</Card>
			</div>
		);
	}
}

MailChimpDashboard.propTypes = {
	siteId: PropTypes.number.isRequired,
	syncStatusData: PropTypes.object,
	isRequestingSettings: PropTypes.bool,
	isSaving: PropTypes.bool,
	newsletterSettingsSubmitError: PropTypes.oneOfType( [
		PropTypes.object,
		PropTypes.bool,
	] ),
	settings: PropTypes.object.isRequired,
	errorNotice: PropTypes.func.isRequired,
	successNotice: PropTypes.func.isRequired,
	submitMailChimpNewsletterSettings: PropTypes.func.isRequired,
	requestResync: PropTypes.func.isRequired,
};

export default connect(
	( state, { siteId } ) => ( {
		siteId,
		syncStatusData: syncStatus( state, siteId ),
		isRequestingSettings: isRequestingSettings( state, siteId ),
		isRequestingSyncStatus: isRequestingSyncStatus( state, siteId ),
		isSaving: isSubmittingNewsletterSetting( state, siteId ),
		saveSettingsRequest: isSavingSettings( state, siteId ),
		newsletterSettingsSubmitError: newsletterSettingsSubmitError( state, siteId ),
		settings: mailChimpSettings( state, siteId ),
	} ),
	{
		errorNotice,
		successNotice,
		submitMailChimpNewsletterSettings,
		requestResync
	}
)( localize( MailChimpDashboard ) );
