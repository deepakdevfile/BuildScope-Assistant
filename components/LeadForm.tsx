import { Selection } from "@/lib/types";

interface Props {
    selection: Selection;
    source: 'wizard' | 'chat';
    transcript?: {
        role: 'user' | 'assistant';
        content: string
    }[];
}


export default function LeadForm({ selection, source, transcript = [] }: Props){

    const input = () => {
        return (
            <div>
                <label htmlFor="">
                    label
                </label>
                <input type="text" />
                <p>if error</p>
            </div>
        )
    }

    return (
        <form action="">
            <h2>Where should we send your brief?</h2>
            <p>
                We reply within 24 hours with a tailored plan.
            </p>
            <div>
                if banner then display it
            </div>
            <div>
                if error then display error
            </div>
            <div>
                {input('name', 'Full name', { max: 80, ac: 'name' })}
                {input('email', 'Email address', { type: 'email', max: 120, ac: 'email' })}
            </div>

            <div>
                {input('company', 'Company', { max: 100, ac: 'organization', optional: true })}
                {input('phone', 'Phone', { type: 'tel', max: 20, ac: 'tel', optional: true })}
            </div>

            {input('message', 'Anything else we should know?', { max: 2000, optional: true, area: true })}
            
            <div>
                <label htmlFor="f-website">Website</label>
                <input id="f-website" type="text" />
            </div>

            <button>
                display on sending status
            </button>
        </form>
    )
}