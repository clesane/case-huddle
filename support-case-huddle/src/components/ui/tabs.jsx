import React, { lazy, Suspense } from 'react';

const TabsPrimitive = lazy(() => import('@radix-ui/react-tabs').then(module => ({ default: module })));

const Tabs = props => (
  <Suspense fallback={<div>Loading...</div>}>
    <TabsPrimitive.Root {...props} />
  </Suspense>
);

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <Suspense fallback={<div>Loading...</div>}>
    <TabsPrimitive.List
      ref={ref}
      className={className}
      {...props}
    />
  </Suspense>
));

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <Suspense fallback={<div>Loading...</div>}>
    <TabsPrimitive.Trigger
      ref={ref}
      className={className}
      {...props}
    />
  </Suspense>
));

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <Suspense fallback={<div>Loading...</div>}>
    <TabsPrimitive.Content
      ref={ref}
      className={className}
      {...props}
    />
  </Suspense>
));

export { Tabs, TabsList, TabsTrigger, TabsContent };