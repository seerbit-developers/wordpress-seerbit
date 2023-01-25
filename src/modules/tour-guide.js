import React, { memo, useState, useEffect } from "react";

export const steps = [
  {
    selector: "#home",
    content: () => (
      <div className="py-3">
        Get an overview of your business and track your business activities at a
        glance.
      </div>
    ),
  },
  {
    selector: "#transactions",
    content: () => (
      <div className="py-3">
        View, export and filter through your transaction.
      </div>
    ),
  },
  // {
  //   selector: "#sales",
  //   content: () => (
  //     <div className="py-3">
  //       Manage your Branches, Pocket transactions and view your customers.
  //     </div>
  //   ),
  // },
  {
    selector: "#finance",
    content: () => (
      <div className="py-3">
        <ul>
          <li>View settlements to see your earnings and gateway charges</li>
          <li>
            View, manage and respond to disputed transactions raised from your
            customers bank
          </li>
          <li>View, filter and export through refunded transactions</li>
        </ul>
      </div>
    ),
  },
  {
    selector: "#account",
    content: () => (
      <div className="py-3">
        Manage your account settings, update business information, settlement
        account information, copy or reset api keys, configure payment channels,
        customizeyour checkout modal, setup notifications(webhook) and Manage
        your business users.
      </div>
    ),
  },
  {
    selector: "#business",
    content: () => (
      <div className="py-3">
        <ul>
          <li>Add or switch between businesses on your account</li>
          <li>Togglebetween test and live mode</li>
          <li>Logout from your account</li>
        </ul>
      </div>
    ),
  },
];
