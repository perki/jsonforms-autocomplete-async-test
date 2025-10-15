import { searchMedications, type Medication } from './api';
import { JsonForms } from '@jsonforms/react';
import SearchField, { AutocompleteApiTester } from './SearchField';
import {
  materialRenderers
} from '@jsonforms/material-renderers';


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

export default function App() {

  const stringifiedData = '{}'; //useMemo(() => JSON.stringify(eventData, null, 2), [formData]);


  let i = 1;

 const schema = {
    'type': 'object',
    'properties': {
      'api_field': {
        'type': 'string',
        'description': 'Select an option'
      }
    }
  };


  async function autoCompleteAsyncCallBack(query: string): Promise<{const: string, title: string, data: any}[]> {
     try {
      const response = await searchMedications(query);
      console.log('response', {response});
      const props = response.map((med: any) => ({data: med, const: med.hdsId, title: med.description?.en || med.hdsId}));
      return props;
    } catch (error) {
      console.error('Failed to fetch options:', error);
    }
    return [];
  }

  function autoCompleteHelperText(med: Medication): string {
    console.log('autoCompleteHelperText', med);
    if (med == null) return schema.properties.api_field.description;
    return `Code: ${med.system} - ${med.code}`;
  }

  const uischema = {
    'type': 'Control',
    'scope': '#/properties/api_field',
    'options': {
      'autocompleteApi': true,
      'autocompleteAsyncCallBack': autoCompleteAsyncCallBack,
      'autoCompleteHelperText': autoCompleteHelperText
    }
  };

  const data = {};

  const middleware = (state: any, action: any, defaultReducer: any) => {
      console.log('test middleware' + i++, {state, action});
      return defaultReducer(state, action);
    };
  const onChange = function (changeObject: any) {
    console.log('test onChange' + i++, {changeObject});
  };

  return (
    <div className="container">
      <h1>test zone</h1>
       <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={[...materialRenderers, { renderer: SearchField, tester: AutocompleteApiTester }]}
        onChange={onChange}
        middleware={middleware}
      />
      <hr/>
      <div style={classes.dataContent}>
        <pre id="boundData">{stringifiedData}</pre>
      </div>
    </div>
  );
}


