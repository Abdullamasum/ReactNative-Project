import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Input, Button} from '@rneui/base';
import {useUser} from '../../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import {mainAppColor} from '../../utils/colors';

const RegisterForm = (props) => {
  const {postUser, checkUsername} = useUser();
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      full_name: '',
    },
    mode: 'onBlur',
  });
  const [displayPassword, changeDisplayPassword] = useState(false);

  const setToggleForm = props.setToggleForm;

  const register = async (userData) => {
    delete userData.confirmPassword;
    console.log('Registering: ', userData);

    try {
      const registerResult = await postUser(userData);
      console.log('Register, register', registerResult);

      if (registerResult.user_id === null) return;

      // Successful register! Notify the user and toggle back to login form!
      Alert.alert(
        'Register Successful!',
        'Proceed to log in with your new user information.',
        [
          {
            text: 'Ok',
            onPress: () => {
              setToggleForm(true); // Toggles the form to login
            },
          },
        ]
      );
    } catch (error) {
      console.error('Register, register: ', error);
      return;
    }
  };

  const checkUser = async (username) => {
    try {
      const userAvailable = await checkUsername(username);
      console.log('RegisterForm, checkUser: ' + userAvailable);
      return userAvailable || 'Username is already taken';
    } catch (error) {
      console.error('RegisterForm, checkUser: ', error.message);
    }
  };

  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
          minLength: {value: 3, message: 'Minimum length is 3'},
          validate: {checkUser},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            autoCapitalize="none"
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.username && errors.username.message}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
          minLength: {value: 2, message: 'Must be at least 2 characters'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Full Name"
            autoCapitalize="words"
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.full_name && errors.full_name.message}
          />
        )}
        name="full_name"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
          minLength: {value: 5, message: 'Must have at least 5 characters'},
          pattern: {
            value: /(?=.*\p{Lu})(?=.*[0-9]).{5,}/u,
            message: 'Must include one upper case letter and one number',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Password"
            secureTextEntry={!displayPassword}
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.password && errors.password.message}
          />
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          validate: (value) => {
            if (value === getValues('password')) {
              return true;
            }
            return 'Password needs to match';
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Confirm Password"
            secureTextEntry={!displayPassword}
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={
              errors.confirmPassword && errors.confirmPassword.message
            }
          />
        )}
        name="confirmPassword"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Required'},
          pattern: {
            value: /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            message: 'Invalid Email form',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Email"
            autoCapitalize="none"
            onblur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.email && errors.email.message}
          />
        )}
        name="email"
      />
      <Button
        title={displayPassword ? 'Hide Password' : 'Show Password'}
        color={mainAppColor}
        onPress={() => {
          changeDisplayPassword(!displayPassword);
        }}
      />

      <CardDivider />

      <Button
        title="Register"
        color={mainAppColor}
        onPress={handleSubmit(register)}
      />
    </View>
  );
};

RegisterForm.propTypes = {
  setToggleForm: PropTypes.func,
};

export default RegisterForm;
