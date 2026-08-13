```jsx id="0hfyjv"
import CardProjects from "../components/CardProjects";

function Portfolio(){

    return(

        <section id="portfolio">

            <h2>
                Project Saya
            </h2>

            <div className="project-container">

                <CardProjects
                    title="Sistem Pembayaran Cafe"
                    desc="Aplikasi kasir cafe berbasis Python Tkinter."
                />

                <CardProjects
                    title="Sistem Kost Desktop"
                    desc="Aplikasi manajemen kost sederhana."
                />

                <CardProjects
                    title="Monitoring Kelas"
                    desc="Sistem monitoring kelas menggunakan MariaDB."
                />

            </div>

        </section>

    );

}

export default Portfolio;
```
