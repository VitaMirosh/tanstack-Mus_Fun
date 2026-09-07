import {getPaginationPages} from '../utils/get-pagination-pages.ts';
import s from './pagination-nav.module.css'

type Props ={
  current:number
  pageCount:number
  onChange:(page:number) => void
  isFetching:boolean
}
 const SIBLING_COUNT  = 1
 export const PaginationNav = ({current,pageCount,onChange }: Props) => {
  const pages = getPaginationPages(current,pageCount,SIBLING_COUNT)

   return (
     <div className={s.pagination}>
       {pages.map((item,ind)=>
       item === '...' ? (
         <span className={s.ellipsis} key={`ellipsis-${ind}`}>
           ...
         </span>
       ): <button key={item}  className={item === current ? `${s.pageButton} ${s.pageButtonActive}` : s.pageButton}
                  onClick={()=> item!== current && onChange(Number(item))}
                  disabled={item===current}
                  type={'button'}>{item}</button>

       )}
     </div>
   )
 }