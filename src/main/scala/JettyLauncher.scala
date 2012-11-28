/*
 * Starts jetty for scalatra programatically
 */

import org.eclipse.jetty.server.handler.{ContextHandlerCollection, ContextHandler, ResourceHandler}
import org.eclipse.jetty.server.Server
import org.eclipse.jetty.servlet.{ServletHolder, ServletContextHandler}
import org.eclipse.jetty.webapp.WebAppContext

object JettyLauncher {
  def main(args: Array[String]) {
    val port = if(System.getenv("PORT") != null) System.getenv("PORT").toInt else 8080
    val server = new Server(port)

    val contexts = new ContextHandlerCollection()
    server.setHandler(contexts)
    contexts.addHandler(new WebAppContext("src/main/webapp", "/"))
    server.start
    server.join
  }
}
