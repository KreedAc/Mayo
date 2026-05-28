import { getMenu } from '@/lib/menu'
import MenuApp from '@/components/MenuApp'

export const revalidate = 60

export default async function HomePage() {
  const { menu, info, hours } = await getMenu()
  return <MenuApp menu={menu} info={info} hours={hours} />
}
