using Sitecore.JavaScriptServices.Configuration;
using Sitecore.LayoutService.ItemRendering.Pipelines.GetLayoutServiceContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSS_1
{
    public class AddPersonalizationContext : Sitecore.JavaScriptServices.ViewEngine.LayoutService.Pipelines.GetLayoutServiceContext.JssGetLayoutServiceContextProcessor
    {
        public AddPersonalizationContext(IConfigurationResolver configurationResolver) : base(configurationResolver)
        {
        }

        protected override void DoProcess(GetLayoutServiceContextArgs args, AppConfiguration application)
        {
            if (args.RenderedItem != null)
            {
                Sitecore.Layouts.RenderingReference[] renderings = args.RenderedItem.Visualization.GetRenderings(Sitecore.Context.Device, false);

                var personalizedPlaceholders = renderings
                    .Where(i => i.Settings.Rules.Count > 0)
                    .Select(i => i.Placeholder)
                    .ToList();                

                args.ContextData.Add("personalization", new
                {
                    personalizedPlaceholders = personalizedPlaceholders,
                });
            }
        }
    }
}