/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import {render, screen, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import Vendor from './Vendor';

describe('Vendor', () => {

    test('should render Vendor', async () => {
        const requestPickup = jest.fn();
        const vendor = {
            name: "Name 1",
            id: "ABCD",
            relay: {
                requestPickup
            },
            toJSON() { 
                return {
                    name: this.name,
                    id: this.id
                };
            }
        };
        const wrapper = (
            <Vendor vendor={ vendor }></Vendor>
        );
        render(wrapper);

        const button = await screen.findByText("Request Pickup");
        expect(button).toBeDefined();
        fireEvent.click(button);
        expect(requestPickup).toBeCalled()

    });

});