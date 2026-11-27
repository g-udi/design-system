import {
  NavigationMenu,
  NavigationMenuAside,
  NavigationMenuDropdown,
  NavigationMenuLink,
  NavigationMenuList
} from '@gaudi/design-system/core/NavigationMenu';
const blog = 'https://assaf.website/blog';
const categories = [
  { title: 'Data', description: 'Everything AI, ML and Data', href: `${blog}/categories/data` },
  { title: 'Productivity', description: 'Productivity, tools and tips', href: `${blog}/categories/productivity` },
  {
    title: 'Management',
    description: 'Engineering management and leadership',
    href: `${blog}/categories/management`
  },
  {
    title: 'Engineering',
    description: 'Development, programming and code',
    href: `${blog}/categories/engineering`
  }
];
const recentPosts = [
  {
    title: 'Improvement Kata: Making Better a Habit',
    date: 'November 16, 2025',
    href: `${blog}/category/management/improvement-kata`
  },
  {
    title: 'Introduction to Classical Agile: Scrum and Kanban',
    date: 'November 14, 2025',
    href: `${blog}/category/management/introduction-to-classical-agile`
  },
  {
    title: 'LaTeX Tips and Best Practices',
    date: 'March 27, 2017',
    href: `${blog}/category/productivity/latex-best-practices`
  }
];
export function Pattern() {
  return (
    <div className='flex min-h-[26rem] items-start justify-center'>
      <NavigationMenu label='Blog navigation' className='w-auto min-w-0 max-w-full'>
        <NavigationMenuList className='justify-center'>
          <NavigationMenuLink href={`${blog}/publications`}>Publications</NavigationMenuLink>
          <NavigationMenuLink href={`${blog}/projects`}>Projects</NavigationMenuLink>
          <NavigationMenuLink href={`${blog}/categories/thoughts`}>Thoughts</NavigationMenuLink>
          <NavigationMenuDropdown
            label='Blog'
            align='center'
            width='2xl'
            aside={
              <NavigationMenuAside title='Recent posts' action={{ href: blog, label: 'See all' }}>
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
