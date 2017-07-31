<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="EmptyVWPUserControl.ascx.cs" Inherits="SP2016_WP_Knockout.Contents.WebParts.EmptyVWP.EmptyVWPUserControl" %>

<SharePoint:ScriptLink language="javascript" name="/_layouts/15/SP2016-WP-Knockout/Script/libs.min.js" OnDemand="false" runat="server" Localizable="false" />

<script type="text/javascript">
	ExecuteOrDelayUntilScriptLoaded(function () {
		System.config({ defaultJSExtensions: true, baseURL: '/_layouts/15/SP2016-WP-Knockout/script' });
		System.import('EmptyVWP.Load.js').then(null, console.error.bind(console));
	}, 'sp.js');
</script>

<empty-web-part></empty-web-part>