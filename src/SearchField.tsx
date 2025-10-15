// AutoCompleteApiControl.js
import { useState, useEffect } from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Autocomplete , FormControl, TextField } from '@mui/material';

// no direct API import here; options are provided via uischema callback

const AutoCompleteApiControl = ( { data, handleChange, path, schema, uischema }: any) => {
  const [proposals, setProposals] = useState<{data: any, const: string, title: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const autoCompleteAsyncCallBack: (query: string) => Promise<{data: any, const: string, title: string}[]> = uischema?.options?.autocompleteAsyncCallBack;
  if (autoCompleteAsyncCallBack == null) throw new Error('Missing uischema.options.autoCompleteAsyncCallBack');

  const autoCompleteHelperText: (data: any) => string = uischema?.options?.autoCompleteHelperText || (() => schema.description);

  // API call on input change
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const props = await autoCompleteAsyncCallBack(inputValue);
        if (Array.isArray(props)) {
          setProposals(props);
        } else {
          console.log('Prop not array', props);
        }
      } catch (error) {
        console.error('Failed to fetch options:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [inputValue]);

  const myhandleChange = function (event: any, newValue: {data: any, const: string, title: string} | null) {
    console.log('myhandleChange', event, newValue);
    handleChange(path, newValue ? newValue.const : undefined);
  };

  const myInputChange = function (event: any, newInputValue: any) {
    console.log('myInputChange', event, newInputValue);
    setInputValue(newInputValue);
  };

  return (
    <FormControl fullWidth>
      <Autocomplete
        options={proposals}
        loading={loading}
        value={proposals.find(p => p.const === data) || null}
        onChange={myhandleChange}
        inputValue={inputValue}
        onInputChange={myInputChange}
        getOptionLabel={(option) => option?.title ?? ''}
        isOptionEqualToValue={(option, value) => option?.const === value?.const}
        renderOption={(liProps, option) => (
          <li {...liProps} key={option.const}>{option.title}</li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={schema.title || path}
            helperText={autoCompleteHelperText(proposals.find(p => p.const === data)?.data)}
          />
        )}
      />
    </FormControl>
  );
};

// --- Tester
import { rankWith, hasOption, isStringControl, and } from '@jsonforms/core';

// This tester will trigger the custom renderer when a UI schema control has
// a specific custom property, like "render: 'autocomplete-api'".
export const AutocompleteApiTester = rankWith(
  3, // A higher rank gives this renderer precedence
  and(
    isStringControl,
    hasOption('autocompleteApi')
  )
);


const SearchFieldRenderer = withJsonFormsControlProps(AutoCompleteApiControl);

export default SearchFieldRenderer;

