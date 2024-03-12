function MailChimp_NewsLetter_Signup( email, merge_fields, callback )
{
    return AJAX_Call_Module( callback,
                             'runtime',
                             'mailchimp',
                             'MailChimp_NewsLetter_Signup',
                             'Email_Address=' + encodeURIComponent( email ) +
                             '&Merge_Fields=' + EncodeArray( merge_fields ) );
}

function MailChimp_NewsLetter_Unsubscribe( email, callback )
{
    return AJAX_Call_Module( callback,
                             'runtime',
                             'mailchimp',
                             'MailChimp_NewsLetter_Unsubscribe',
                             'Email_Address=' + encodeURIComponent( email ) );
}

function MailChimp_NewsLetter_Signup_Submit( identifier )
{
    var i, i_len, merge_fields, elementlist_email, elementlist_message, elementlist_merge_fields;

    elementlist_email           = document.querySelectorAll( '[data-mailchimp-identifier="' + identifier + '-email"]' );
    elementlist_message         = document.querySelectorAll( '[data-mailchimp-identifier="' + identifier + '-message"]' );
    elementlist_merge_fields    = document.querySelectorAll( '[data-mailchimp-identifier="' + identifier + '-merge-fields"]' );
    merge_fields                = new Array();

    if ( elementlist_email.length == 0 || ( typeof elementlist_email[ 0 ].value !== 'string' ) || elementlist_email[ 0 ].value.length == 0 )
    {
        return alert( 'You must specify an email address' );
    }

    for ( i = 0, i_len = elementlist_merge_fields.length; i < i_len; i++ )
    {
        if ( typeof elementlist_merge_fields[ i ].name === 'string' && elementlist_merge_fields[ i ].name.length )
        {
            merge_fields.push( encodeURIComponent( elementlist_merge_fields[ i ].name ) + ':' + encodeURIComponent( elementlist_merge_fields[ i ].value ) );
        }
    }

    MailChimp_NewsLetter_Signup( elementlist_email[ 0 ].value, merge_fields, function( response )
    {
        if ( !response.success )
        {
            return alert( response.error_message );
        }

        if ( elementlist_message.length )
        {
            elementlist_message[ 0 ].textContent = 'Congratulations, you\'ve been subscribed!';
        }
    } );
}

function MailChimp_NewsLetter_Unsubscribe_Submit( identifier )
{
    var i, i_len, elementlist_email, elementlist_message;

    elementlist_email   = document.querySelectorAll( '[data-mailchimp-identifier="' + identifier + '-email"]' );
    elementlist_message = document.querySelectorAll( '[data-mailchimp-identifier="' + identifier + '-message"]' );

    if ( elementlist_email.length == 0 || ( typeof elementlist_email[ 0 ].value !== 'string' ) || elementlist_email[ 0 ].value.length == 0 )
    {
        return alert( 'You must specify an email address' );
    }

    MailChimp_NewsLetter_Unsubscribe( elementlist_email[ 0 ].value, function( response )
    {
        if ( !response.success )
        {
            return alert( response.error_message );
        }

        if ( elementlist_message.length )
        {
            elementlist_message[ 0 ].textContent = 'Congratulations, you\'ve unsubscribed!';
        }
    } );
}