import React from "react";
import Counter from "../app/components/Counter";

export default {
  title: "YourComponent",
  component: Counter,
};

const Template = (args) => <Counter {...args} />;

export const FirstStory = Template.bind({});

FirstStory.args = {};
