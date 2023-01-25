import React from "react";
import {act, render, screen} from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import Page from "../users_management";
import { Provider } from 'react-redux';
import giveMeStore from "../../../store";
import i18n from "../../../i18n";
import {I18nextProvider} from "react-i18next";

test('it renders the account settings page',  async ()=>{
    const {queryAllByText,queryByText, debug, getByTestId} = await render(
        <Provider store={giveMeStore()}>
            <Page />
        </Provider>
            );
    userEvent.click(screen.queryByText('Invite a team member'))
    // await act( async () => await debug() )
    expect(screen.getByText('Invite')).toBeTruthy()
});

test('fails invite team member with missing form values',  async ()=>{
    const {queryAllByText,queryByText, debug, getByTestId} = await render(
        <Provider store={giveMeStore()}>
            <Page />
        </Provider>);

    await act( async ()=> await userEvent.click(screen.queryByText('Invite a team member')))
    await act( async ()=> await userEvent.click(screen.queryByText('Invite')))

    expect(screen.queryByText('Invitee Full Name field is required')).toBeTruthy()
    expect(screen.queryByText('Invitee Email field is required')).toBeTruthy()
    // expect(screen.queryByText('A role is required')).toBeTruthy()
});

