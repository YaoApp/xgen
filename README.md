# xgen next version

## Why

The past code is not enough to support newer and better ideas, and at the beginning of writing xgen mainly for internal business, there is no time to think too much about the writing method and architecture, I am committed to pursuing a kind of beauty, this kind of beauty is not only Performance is more likely to be reflected in the ideological and architectural level, so I choose to refactor based on umi4.0, swc, mobx. After refactoring, I hope that I can regard xgen as a "work", a "artwork", Not just a project to make a living.

## Target

After careful consideration, we believe that the mode based on type page can be realized by json template parsing, so that it will not be very cumbersome to use template to write page json, so we remade xgen, and a core concept after refactoring is:

Every route is a dynamic route, everything is component, no Table Page, no Chart Page, you can inject data by writing json, and then assign the data to table component and chart component.

Of course, the configuration of the base components is mostly unchanged.