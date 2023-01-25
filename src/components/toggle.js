import React from "react";
import { Switch } from "@headlessui/react";

export default function AppToggle({ active = false, onChange, activeClass }) {
  return (
    <div className="py-16">
      <Switch
        checked={typeof active == 'function' ? active() : active}
        onChange={onChange}
        className={`button__toggle ${
          active ? `button__toggle--active ${activeClass || ""}` : ""
        }`}
      >
        <span
          aria-hidden="true"
          className={`${active ? "translate-x-9" : "translate-x-0"}
                        button__toggle--button shadow-lg`}
        />
      </Switch>
    </div>
  );
}
