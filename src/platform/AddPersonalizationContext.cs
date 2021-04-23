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

                var personalizedRenderings = renderings
                    .Where(i => i.Settings?.Rules?.Count > 0)
                    .Select(i => new { 
                        i.Placeholder,
                        i.RenderingID,
                        uid = Guid.TryParse(i.UniqueId, out _) ? Guid.Parse(i.UniqueId).ToString("D").ToLower() : Guid.Empty.ToString("D"),
                        i.Settings.DataSource,
                        i.Settings.Parameters,
                        RenderingPlaceholder = i.RenderingItem.Placeholder                        
                    })
                    .ToList();                

                args.ContextData.Add("personalization", new
                {
                    personalizedRenderings = personalizedRenderings
                });
            }
        }
    }
}