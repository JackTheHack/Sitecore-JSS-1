import { Text, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { StyleguideComponentProps } from 'lib/component-props';

type MyTestComponentProps = StyleguideComponentProps & {
  fields: {
    heading: Field<string>;
  };
}

const MyTestComponent = (props: MyTestComponentProps): JSX.Element => (
  <div>
    <p>MyTestComponent Component</p>
    <Text field={props.fields.heading} />
  </div>
);

export default MyTestComponent; 
