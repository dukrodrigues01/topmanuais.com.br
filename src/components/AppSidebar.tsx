import { useMemo } from 'react'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar" // Importa da sua infraestrutura
import { useAdmin } from '@/context/AdminContext'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Filter, X } from 'lucide-react'

interface AppSidebarProps {
  currentCategorySlug: string
  selectedBrands: string[]
  onBrandChange: (slug: string) => void
  selectedSubs: string[]
  onSubChange: (slug: string) => void
  onClear: () => void
}

export function AppSidebar({
  currentCategorySlug,
  selectedBrands,
  onBrandChange,
  selectedSubs,
  onSubChange,
  onClear
}: AppSidebarProps) {
  const { categories, products } = useAdmin()

  const currentCategory = categories.find(c => c.slug === currentCategorySlug)

  // Filtra Marcas Ativas (com produtos publicados nesta categoria)
  const activeBrands = useMemo(() => {
    return (currentCategory?.brands || []).filter(brand => {
      const count = products.filter(p => 
        p.category === currentCategorySlug && p.brand === brand.slug && p.status === 'published'
      ).length
      brand.count = count // Injeta contagem para o badge
      return count > 0
    })
  }, [currentCategory, products, currentCategorySlug])

  // Filtra Subcategorias Ativas
  const activeSubs = useMemo(() => {
    return (currentCategory?.subcategories || []).filter(sub => {
      const count = products.filter(p => 
        p.category === currentCategorySlug && p.subcategory === sub.slug && p.status === 'published'
      ).length
      sub.count = count
      return count > 0
    })
  }, [currentCategory, products, currentCategorySlug])

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-blue-600">
            <Filter className="size-4" />
            <span>Filtros Técnicos</span>
          </div>
          {(selectedBrands.length > 0 || selectedSubs.length > 0) && (
            <button onClick={onClear} className="text-[10px] text-red-500 hover:underline">
              Limpar tudo
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* GRUPO DE MARCAS */}
        <SidebarGroup>
          <SidebarGroupLabel>Fabricantes / Marcas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeBrands.map((brand: any) => (
                <SidebarMenuItem key={brand.id}>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <Checkbox 
                      id={brand.slug} 
                      checked={selectedBrands.includes(brand.slug)}
                      onCheckedChange={() => onBrandChange(brand.slug)}
                    />
                    <label htmlFor={brand.slug} className="text-sm flex-1 cursor-pointer">
                      {brand.name}
                    </label>
                    <Badge variant="outline" className="text-[10px] opacity-60">
                      {brand.count}
                    </Badge>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GRUPO DE TIPOS (SUBCATEGORIAS) */}
        <SidebarGroup>
          <SidebarGroupLabel>Tipo de Manual</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeSubs.map((sub: any) => (
                <SidebarMenuItem key={sub.id}>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <Checkbox 
                      id={sub.slug} 
                      checked={selectedSubs.includes(sub.slug)}
                      onCheckedChange={() => onSubChange(sub.slug)}
                    />
                    <label htmlFor={sub.slug} className="text-sm flex-1 cursor-pointer">
                      {sub.name}
                    </label>
                    <Badge variant="outline" className="text-[10px] opacity-60">
                      {sub.count}
                    </Badge>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}