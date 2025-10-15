// AutoCompleteApiControl.js
import React, { useState, useEffect } from 'react';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Autocomplete , FormControl, TextField } from '@mui/material';

import { searchMedications } from './api';

const AutoCompleteApiControl = ( { data, handleChange, path, schema, uischema }: any) => {
  const [proposals, setProposals] = useState<{const: string, title: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');

  console.log('options', uischema.options);

  const autoCompleteAsyncCallBack: (query: string) => Promise<{data: any, const: string, title: string}[]> = uischema?.options?.autocompleteAsyncCallBack;
  console.log(autoCompleteAsyncCallBack);
  if (autoCompleteAsyncCallBack == null) throw new Error('Missing uischema.options.autoCompleteAsyncCallBack');

  // Example API call
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

  const myhandleChange = function (event: any, newValue: any) {
    console.log('myhandleChange', event, newValue);
    handleChange(path, newValue);
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
        value={data || null}
        onChange={myhandleChange}
        inputValue={inputValue}
        onInputChange={myInputChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={schema.title || path}
            helperText={schema.description}
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

