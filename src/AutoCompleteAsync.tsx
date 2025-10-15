// AutoCompleteAsyncControl.js
import { useState, useEffect } from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Autocomplete , FormControl, TextField } from '@mui/material';

// no direct API import here; options are provided via uischema callback

interface AutoCompleteAsyncProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
  schema: JsonSchema;
  uischema: UISchemaElement;
}


export type AutoCompleteOption = {
  data: any,
  const: string,
  title: string
}

/**
 * @return a textual description of the selected item if any
 */
export type AutoCompleteAsyncCallBack = (query: string) => Promise<AutoCompleteOption[]>;

/**
 * @return a textual description of the selected item if any
 */
export type AutoCompleteHelperText = (option: AutoCompleteOption) => string;

const AutoCompleteAsyncControl = ({ data, handleChange, path, schema, uischema }: AutoCompleteAsyncProps) => {
  // -- load from usischema config
  const autoCompleteAsyncCallBack: AutoCompleteAsyncCallBack = uischema?.options?.autoCompleteAsyncCallBack;
  if (autoCompleteAsyncCallBack == null) throw new Error('Missing uischema.options.autoCompleteAsyncCallBack');
  const autoCompleteHelperText: AutoCompleteHelperText = uischema?.options?.autoCompleteHelperText || (() => schema.description);
  // --
  const [options, setOptions] = useState<AutoCompleteOption[]>([]);
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
          setOptions([]);
        }
      } catch (error) {
        setOptions([]);
        console.error('Failed to fetch options:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [inputValue]);

  const myOnChange = function (event: any, newValue: AutoCompleteOption | null) {
    handleChange(path, newValue);
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
        forcePopupIcon={false}
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
export const AutocompleteAsyncTester = rankWith(
  3, // A higher rank gives this renderer precedence
  and(
    isStringControl,
    hasOption('autoCompleteAsyncCallBack')
  )
);


const AutoCompleteAsyncRenderer = withJsonFormsControlProps(AutoCompleteAsyncControl);

export default AutoCompleteAsyncRenderer;

