import { getMenu } from '@/lib/menu'
import MenuApp from '@/components/MenuApp'

export const revalidate = 0

export default async function HomePage() {
  const { menu, info, hours, closures, banner } = await getMenu()
  return <MenuApp menu={menu} info={info} hours={hours} closures={closures} banner={banner} />
}
