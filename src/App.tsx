import { searchMedications, type Medication } from './api';
import { JsonForms } from '@jsonforms/react';
import SearchField, {
  AutocompleteApiTester,
  type AutoCompleteAsyncOption
} from './SearchField';
import { materialRenderers } from '@jsonforms/material-renderers';
import { useState, useMemo } from 'react';

// CSS Classes
const classes = {
  dataContent: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '0.25em',
    backgroundColor: '#cecece',
    marginBottom: '1rem'
  }
};

const testFormData = medToOption({
  label: {
    en: 'corticotropin'
  },
  system: 'ATC',
  source: {
    key: 'WHO'
  },
  description: {
    en: 'corticotropin 25 unit parenteral'
  },
  code: 'H01AA01',
  meta: {
    dosageValue: 25,
    dosageUnit: 'U',
    administrationRouteATC: 'P',
    contextsTxt: [
      'SYSTEMIC HORMONAL PREPARATIONS, EXCL. SEX HORMONES AND INSULINS',
      'PITUITARY AND HYPOTHALAMIC HORMONES AND ANALOGUES',
      'ANTERIOR PITUITARY LOBE HORMONES AND ANALOGUES',
      'ACTH'
    ]
  },
  hdsId: 'S:ATC/k:WHO/C:H01AA01/XadmRoute:P/XdosageValue:25'
});

export default function App() {
  const [formData, setFormData] = useState<object>({ api_field: testFormData });
  const stringifiedData = useMemo(
    () => JSON.stringify(formData, null, 2),
    [formData]
  );

  const schema = {
    type: 'object',
    properties: {
      api_field: {
        type: 'string',
        description: 'Select an option',
        minLength: 3
      }
    }
  };

  async function autoCompleteAsyncCallBack(
    query: string
  ): Promise<AutoCompleteAsyncOption[]> {
    try {
      const response = await searchMedications(query);
      const options = response.map((med: Medication) => medToOption(med));
      return options;
    } catch (error) {
      console.error('Failed to fetch options:', error);
    }
    return [];
  }

  function autoCompleteHelperText(option: AutoCompleteAsyncOption): string {
    console.log('autoCompleteHelperText', option);
    const med: Medication | null = option?.data;
    if (med == null) return schema.properties.api_field.description;
    return `Code: ${med.system} - ${med.code}`;
  }

  const uischema = {
    type: 'Control',
    title: 'Medication',
    scope: '#/properties/api_field',
    options: {
      autocompleteAsyncCallBack: autoCompleteAsyncCallBack,
      autoCompleteHelperText: autoCompleteHelperText
    }
  };

  const onChange = function (changeObject: any) {
    console.log('test onChange', { changeObject });
    setFormData(changeObject.data);
  };

  return (
    <div className="container">
      <h1>test zone</h1>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={formData}
        renderers={[
          ...materialRenderers,
          { renderer: SearchField, tester: AutocompleteApiTester }
        ]}
        onChange={onChange}
      />
      <hr />
      <div style={classes.dataContent}>
        <pre id="boundData">{stringifiedData}</pre>
      </div>
    </div>
  );
}

function medToOption(med: Medication): AutoCompleteAsyncOption {
  return {
    data: med,
    const: med.hdsId,
    title: med.description?.en || med.hdsId
  };
}
