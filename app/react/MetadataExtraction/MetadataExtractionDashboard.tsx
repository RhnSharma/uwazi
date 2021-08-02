import React from 'react';
import { connect } from 'react-redux';
import { Icon } from 'UI';

import { t } from 'app/I18N';
import Icons from 'app/Templates/components/Icons';
import { IImmutable } from 'shared/types/Immutable';
import { TemplateSchema } from 'shared/types/templateType';
import { PropertySchema } from 'shared/types/commonTypes';

export interface MetadataExtractionDashboardPropTypes {
  templates: IImmutable<TemplateSchema[]>;
  extractionSettings: Map<string, string | Array<string>>[];
}

function mapStateToProps({ settings, templates }: any) {
  return {
    extractionSettings: settings.collection.get('features')?.get('metadata-extraction'),
    templates,
  };
}

class MetadataExtractionDashboard extends React.Component<MetadataExtractionDashboardPropTypes> {
  arrangeTemplatesAndProperties() {
    const formatted: {
      [key: string]: {
        firstProperty: PropertySchema;
        templates: TemplateSchema[];
      };
    } = {};

    this.props.extractionSettings.forEach(setting => {
      const template = setting.has('id')
        ? this.props.templates.find(temp => temp?.get('_id') === setting.get('id'))
        : this.props.templates.find(temp => temp?.get('name') === setting.get('name'));
      if (!template) {
        throw new Error(`Template "${setting.get('_id') || setting.get('name')}" not found.`);
      }

      const properties: Array<string> = setting.get('properties');
      properties.forEach(propLabel => {
        const prop =
          template.get('properties')?.find(p => p?.get('label') === propLabel) ||
          template.get('commonProperties')?.find(p => p?.get('label') === propLabel);
        if (!prop) {
          throw new Error(
            `Property "${propLabel}" not found on template "${template.get('name')}".`
          );
        }
        if (!formatted.hasOwnProperty(propLabel)) {
          formatted[propLabel] = {
            firstProperty: prop.toJS(),
            templates: [template.toJS()],
          };
        } else {
          formatted[propLabel].templates.push(template.toJS());
        }
      });
    });

    return formatted;
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">{t('System', 'Metadata extraction dashboard')}</div>
        <div className="panel-subheading">
          {t('System', 'Extract information from your documents')}
        </div>
        <div className="metadata-extraction-table">
          <table className="table">
            <thead>
              <tr>
                <th>Metadata to extract</th>
                <th>Template</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(this.arrangeTemplatesAndProperties()).map(([propName, data]) => (
                <tr key={propName}>
                  <td>
                    <Icon icon={Icons[data.firstProperty.type]} fixedWidth />
                    {propName}
                  </td>
                  <td className="templateNameViewer">
                    {data.templates.map((template, index) => (
                      <div key={template.name}>
                        {template.name}
                        {index !== data.templates.length - 1 ? ',' : ''}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(MetadataExtractionDashboard);