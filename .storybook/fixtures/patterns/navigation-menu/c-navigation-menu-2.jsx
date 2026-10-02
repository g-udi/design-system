import {
  NavigationMenu,
  NavigationMenuAside,
  NavigationMenuDropdown,
  NavigationMenuLink,
  NavigationMenuList
} from '../../../../src/components/core/NavigationMenu/index.js';
const categories = [
  { title: 'Data', description: 'Everything AI, ML and Data', href: '#data' },
  { title: 'Productivity', description: 'Productivity, tools and tips', href: '#productivity' },
  { title: 'Management', description: 'Engineering management and leadership', href: '#management' },
  { title: 'Engineering', description: 'Development, programming and code', href: '#engineering' }
];
const recentPosts = [
  { title: 'Design systems keep editorial rhythm predictable', date: 'May 20, 2026', href: '#design-systems' },
  { title: 'Knowledge graphs for product teams', date: 'April 18, 2026', href: '#knowledge-graphs' },
  { title: 'Component contracts for navigation', date: 'March 16, 2026', href: '#component-contracts' }
];
export function Pattern() {
  return (
    <div className='flex min-h-[26rem] items-start justify-center'>
      <NavigationMenu label='Blog navigation' className='w-auto min-w-0 max-w-full'>
        <NavigationMenuList className='justify-center'>
          <NavigationMenuLink href='#publications'>Publications</NavigationMenuLink>
          <NavigationMenuLink href='#projects'>Projects</NavigationMenuLink>
          <NavigationMenuLink href='#thoughts'>Thoughts</NavigationMenuLink>
          <NavigationMenuDropdown
            label='Blog'
            align='center'
            width='2xl'
            aside={
              <NavigationMenuAside title='Recent posts' action={{ href: '#blog', label: 'See all' }}>
                <ul className='m-0 grid list-none gap-0.5 p-0'>
                  {recentPosts.map((post) => (
                    <li key={post.href}>
                      <NavigationMenuLink variant='panel' href={post.href} description={post.date}>
                        <span className='block truncate'>{post.title}</span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuAside>
            }
          >
            <ul className='m-0 grid list-none content-start gap-0.5 p-0'>
              {categories.map((category) => (
                <li key={category.href}>
                  <NavigationMenuLink variant='panel' href={category.href} description={category.description}>
                    {category.title}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuDropdown>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
