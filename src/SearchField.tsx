// AutoCompleteApiControl.js
import { useState, useEffect } from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Autocomplete , FormControl, TextField } from '@mui/material';

// no direct API import here; options are provided via uischema callback

interface AutoCompleteApiProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
  schema: JsonSchema;
  uischema: UISchemaElement;
}


export type AutoCompleteAsyncOption = {
  data: any,
  const: string,
  title: string
}

const AutoCompleteApiControl = ({ data, handleChange, path, schema, uischema }: AutoCompleteApiProps) => {
  // -- load from usischama config
  const autoCompleteAsyncCallBack: (query: string) => Promise<AutoCompleteAsyncOption[]> = uischema?.options?.autocompleteAsyncCallBack;
  if (autoCompleteAsyncCallBack == null) throw new Error('Missing uischema.options.autoCompleteAsyncCallBack');
  const autoCompleteHelperText: (data: any) => string = uischema?.options?.autoCompleteHelperText || (() => schema.description);

  const [options, setOptions] = useState<AutoCompleteAsyncOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState( data?.title || '');

  // API call on input change
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const newOptions = await autoCompleteAsyncCallBack(inputValue);
        if (Array.isArray(newOptions)) {
          setOptions(newOptions);
        } else {
          console.log('Prop not array', newOptions);
        }
      } catch (error) {
        console.error('Failed to fetch options:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [inputValue]);

  const myOnChange = function (event: any, newValue: AutoCompleteAsyncOption | null) {
    handleChange(path, newValue?.data);
  };

  const newInputValue = function (event: any, newInputValue: string) {
    if (event == null) return; // avoid change on init
    setInputValue(newInputValue);
  };

  return (
    <FormControl fullWidth>
      <Autocomplete
        options={options}
        loading={loading}
        // value='AAA'
        onChange={myOnChange}
        inputValue={inputValue}
        onInputChange={newInputValue}
        getOptionLabel={(option) => option?.title ?? ''}
        isOptionEqualToValue={(option, value) => option?.const === value?.const}
        renderOption={(liProps, option) => (
          <li {...liProps} key={option.const}>{option.title}</li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={schema.title || path}
            helperText={autoCompleteHelperText(data)}
          />
        )}
      />
    </FormControl>
  );
};

// --- Tester
import { rankWith, hasOption, isStringControl, and, UISchemaElement, JsonSchema } from '@jsonforms/core';

// This tester will trigger the custom renderer when a UI schema control has
// a specific custom property, like "render: 'autocomplete-api'".
export const AutocompleteApiTester = rankWith(
  3, // A higher rank gives this renderer precedence
  and(
    isStringControl,
    hasOption('autocompleteAsyncCallBack')
  )
);


const SearchFieldRenderer = withJsonFormsControlProps(AutoCompleteApiControl);

export default SearchFieldRenderer;

