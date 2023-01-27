// import { useMatches } from "@remix-run/react";
// import classNames from "classnames";
// import { Breadcrumbs } from "../design-system/layout/Breadcrumbs";

// export const AutoBreadcrumbs = ({ className }: { className?: string }) => {
//   const matches = useMatches();

//   return (
//     <Breadcrumbs className={classNames("mb-2", className)}>
//       {matches.map((match) => {
//         const breadcrumb = match.handle?.breadcrumb;
//         if (!breadcrumb) return null;

//         if (typeof breadcrumb === "string")
//           return (
//             <Breadcrumbs.Crumb to={match.pathname} key={match.pathname}>
//               {breadcrumb}
//             </Breadcrumbs.Crumb>
//           );

//         return breadcrumb(match);
//       })}
//     </Breadcrumbs>
//   );
// };
